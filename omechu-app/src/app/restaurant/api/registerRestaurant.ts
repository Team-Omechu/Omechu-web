import axios from "axios";

interface OpeningHour {
  [key: string]: string; // 예: "monday": "11:00-19:00"
}

export interface RegisterRestaurantPayload {
  imageUrl?: string;
  name: string;
  repre_menu: string[];
  opening_hour: OpeningHour;
  address: string;
}

export const registerRestaurant = async (
  payload: RegisterRestaurantPayload,
) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/place`,
    payload,
  );
  return response.data;
};
