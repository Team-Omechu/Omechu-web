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
  } catch (error) {
    console.error("Google Place Details API 오류:", error);
    return null;
  }
}

export async function fetchLatLngFromAddress(address: string) {
  try {
    const res = await fetch(
      `/api/geocode?address=${encodeURIComponent(address)}`,
    );
    const data = await res.json();

    const location = data.results?.[0]?.geometry?.location;

    if (!location) {
      throw new Error("Geocoding 실패");
    }

    return {
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
    };
  } catch (error) {
    console.error("주소 → 좌표 변환 실패:", error);
    return null;
  }
}
