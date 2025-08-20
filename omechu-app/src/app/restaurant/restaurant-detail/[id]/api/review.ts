import axiosInstance from "@/lib/api/axios";
import { MostTag, ReviewProps } from "@/lib/types/review";

export interface ReviewRequest {
  rating: number;
  tag: string[];
  imageUrl?: string[];
  reviewText: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  tags: string[];
  text: string;
  createdAt: string;
  like: number;
  reviewImg: { id: number | string; link: string }[];
  user: { id: number | string; nickname: string; profileImageUrl: string };
}

export interface ReviewListResult {
  reviews: ReviewProps[];
  allReviewCount: number;
  avgRating: number;
  mostTag?: MostTag[];
}

export interface ReviewLikeRequest {
  like: boolean;
}

export interface ReviewLikeResponse {
  success?: {
    reviewId?: number;
    like?: number; // 최신 좋아요 수
    isLiked?: boolean; // 현재 내 좋아요 여부
  };
  [key: string]: any;
}

// ✅ 토큰 기반: apiClient 사용
export const postReview = async (id: number, data: ReviewRequest) => {
  const res = await axiosInstance.post(`/place/review/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export function mapReviewResponseToProps(data: any): ReviewProps {
  const rawDate = data.createdAt ?? data.created_at; // 응답 키 대응
  const createdDate = rawDate
    ? new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date(rawDate))
        .replace(/\s/g, "") // 혹시 모를 공백 제거
        .replace(/\./g, ".") // '.' 유지
    : "";

  return {
    id: data.id,
    rating: Number(data.rating),
    tag: data.tag ?? [],
    content: data.text,
    createdDate, // 👉 "2025.05.05"
    votes: data.like,
    userId: data.user.nickname,
    profileImgUrl: data.user.profileImageUrl,
    reviewImg: Array.isArray(data.reviewImg)
      ? data.reviewImg.map((img: any) =>
          typeof img === "string" ? img : img.link,
        )
      : [],
    isVoted: false,
  };
}

// ✅ 무한스크롤 페이지네이션 전용
export async function getReviewsPage(
  restId: number,
  cursor = 0,
  limit = 8,
): Promise<
  ReviewListResult & {
    nextCursor: number | null;
    hasNextPage: boolean;
  }
> {
  if (!Number.isInteger(restId) || restId <= 0) {
    throw new Error(`유효하지 않은 restId입니다: ${restId}`);
  }

  const res = await axiosInstance.get(`/place/review/${restId}`, {
    params: { limit: String(limit), cursor: String(cursor) },
    headers: { "Content-Type": "application/json" },
  });

  const json = res.data;

  const rawReviews: ReviewResponse[] = json?.success?.data ?? [];
  const reviews: ReviewProps[] = rawReviews.map(mapReviewResponseToProps);

  return {
    reviews,
    allReviewCount: json?.success?.allReviewCount ?? 0,
    avgRating:
      typeof json?.success?.avgRating === "number"
        ? json.success.avgRating
        : (json?.success?.avgRating?.rating ?? 0),
    mostTag: json?.success?.mostTag ?? [],
    nextCursor: json?.success?.nextCursor ?? null, // 서버 응답 맞춤
    hasNextPage: json?.success?.hasNextPage ?? false,
  };
}

export async function getMostTags(
  result: ReviewListResult,
): Promise<MostTag[]> {
  return Promise.resolve(result.mostTag ?? []);
}

export async function setReviewLike(
  restId: number,
  reviewId: number,
  like: boolean,
): Promise<{ likeCount: number | null; isLiked: boolean | null }> {
  const res = await axiosInstance.patch(
    `/place/${restId}/like/${reviewId}`,
    { like },
    { headers: { "Content-Type": "application/json" } },
  );

  const raw = res.data;
  const srv = raw?.success ?? raw;

  const likeCount = typeof srv?.like === "number" ? srv.like : null;
  const isLiked = typeof srv?.isLiked === "boolean" ? srv.isLiked : null;

  return { likeCount, isLiked };
}

export async function toggleReviewLike(
  restId: number,
  reviewId: number,
  currentIsLiked: boolean,
  currentVotes: number,
): Promise<{ likeCount: number; isLiked: boolean }> {
  const { likeCount, isLiked } = await setReviewLike(
    restId,
    reviewId,
    !currentIsLiked,
  );

  const safeCount =
    likeCount !== null ? likeCount : currentVotes + (currentIsLiked ? -1 : 1);
  const safeLiked = isLiked !== null ? isLiked : !currentIsLiked;

  return { likeCount: safeCount, isLiked: safeLiked };
}
