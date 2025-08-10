import apiClient from "@/lib/api/client";
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
  mostTags?: MostTag[];
}

// ✅ 토큰 기반: apiClient 사용
export const postReview = async (id: number, data: ReviewRequest) => {
  const res = await apiClient.post(`/place/review/${id}`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

function mapReviewResponseToProps(data: ReviewResponse): ReviewProps {
  return {
    id: data.id,
    rating: Number(data.rating),
    tags: data.tags,
    content: data.text,
    createdDate: new Date(data.createdAt).toLocaleDateString("ko-KR"),
    votes: data.like,
    userId: data.user.nickname,
    profileImgUrl: data.user.profileImageUrl,
    reviewImages: data.reviewImg?.map((img) => img.link) ?? [],
    isVoted: false,
  };
}

// ✅ 토큰 기반 + params
export async function getReviews(
  restId: number,
  limit = 10,
  cursor = 0,
): Promise<ReviewListResult> {
  if (!Number.isInteger(restId) || restId <= 0) {
    throw new Error(`유효하지 않은 restId입니다: ${restId}`);
  }

  const res = await apiClient.get(`/place/review/${restId}`, {
    params: { limit: String(limit), cursor: String(cursor) },
    headers: { "Content-Type": "application/json" },
  });

  const json = res.data;

  const rawReviews: ReviewResponse[] = json?.success?.data ?? [];
  const reviews: ReviewProps[] = rawReviews.map(mapReviewResponseToProps);

  return {
    reviews,
    allReviewCount: json?.success?.allReviewCount ?? 0,
    avgRating: json?.success?.avgRating?.rating ?? 0,
    mostTags: json?.success?.mostTags ?? [],
  };
}

export async function getMostTags(
  result: ReviewListResult,
): Promise<MostTag[]> {
  return Promise.resolve(result.mostTags ?? []);
}
