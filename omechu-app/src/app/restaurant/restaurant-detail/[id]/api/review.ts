import axios from "axios";

export interface ReviewRequest {
  rating: number;
  tag: string[];
  imageUrl?: string[];
  reviewText: string;
}

export const postReview = async (id: number, data: ReviewRequest) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/place/review/${id}`,
    data,
  );
  return response.data;
};
