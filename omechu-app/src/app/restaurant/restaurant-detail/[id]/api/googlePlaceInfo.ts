import axios from "axios";

export interface PlaceLocation {
  latitude: number;
  longitude: number;
}

export interface PlaceInfo {
  formattedAddress: string;
  location: PlaceLocation;
  displayName: { text: string; languageCode: string };
  currentOpeningHours: {
    weekdayDescriptions: {
      days_of_the_week: string;
      time: string;
    }[];
  };
}

export const fetchGooglePlaceInfo = async (
  placeId: string,
): Promise<PlaceInfo> => {
  const res = await axios.get<PlaceInfo>(
    `${process.env.NEXT_PUBLIC_API_URL}/place-detail/${placeId}`,
  );
  return res.data;
};
