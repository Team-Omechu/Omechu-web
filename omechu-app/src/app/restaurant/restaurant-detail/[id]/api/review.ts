import { MostTag, ReviewProps } from "@/lib/types/review";
import axios from "axios";

export interface ReviewRequest {
  rating: number;
  tag: string[];
  imageUrl?: string[];
  reviewText: string;
}

export interface ReviewResponse {
  id: number;
  rating: number;
  tags: string[]; // ← "tag"
  text: string; // ← "text"
  createdAt: string; // ← "created_at"
  like: number; // ← "like"
  reviewImg: {
    id: number | string;
    link: string;
  }[];
  user: {
    id: number | string;
    nickname: string;
    profileImageUrl: string;
  };
}

export interface ReviewListResult {
  reviews: ReviewProps[];
  allReviewCount: number;
  avgRating: number;
  mostTags?: MostTag[];
}

export const postReview = async (id: number, data: ReviewRequest) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/place/review/${id}`,
    data,
    {
      withCredentials: true, // ✅ 쿠키 포함
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.data;
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
    isVoted: false, // 초기값 (클라이언트에서 상태 관리)
  };
}

export async function getReviews(
  restId: number,
  limit = 10,
  cursor = 0,
): Promise<ReviewListResult> {
  if (!Number.isInteger(restId) || restId <= 0) {
    throw new Error(`유효하지 않은 restId입니다: ${restId}`);
  }

  const query = new URLSearchParams({
    limit: limit.toString(),
    cursor: cursor.toString(),
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/place/review/${restId}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 쿠키를 포함하기 위해
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errText = await res.text(); // 혹은 await res.json()도 시도
    console.error("서버 에러 응답:", errText);
    throw new Error("리뷰 데이터를 불러오는 데 실패했습니다");
  }

  const json = await res.json();

  const rawReviews: ReviewResponse[] = json.success.data ?? [];
  console.log("Fetched reviews:", rawReviews);
  const reviews: ReviewProps[] = rawReviews.map(mapReviewResponseToProps);
  console.log("Mapped reviews:", reviews);

  return {
    reviews,
    allReviewCount: json.success.allReviewCount ?? 0,
    avgRating: json.success.avgRating?.rating ?? 0,
    mostTags: json.success.mostTags ?? [],
  };
}

export async function getMostTags(
  result: ReviewListResult,
): Promise<MostTag[]> {
  return Promise.resolve(result.mostTags ?? []);
}
