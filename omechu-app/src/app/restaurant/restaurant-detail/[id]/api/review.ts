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
  tags: string[];
  text: string;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
    profileImgUrl: string;
  };
}

export const postReview = async (id: number, data: ReviewRequest) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/place/review/${id}`,
    data,
  );
  return response.data;
};

export async function getReviews(restId: number, limit = 10, cursor = "") {
  const query = new URLSearchParams({ limit: limit.toString() });
  if (cursor) query.append("cursor", cursor.toString());

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/place/review/${restId}?${query.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // 필요시
    },
  );

  if (!res.ok) throw new Error("리뷰 데이터를 불러오는 데 실패했습니다");

  const json = await res.json();
  return json.data as ReviewResponse[];
}
