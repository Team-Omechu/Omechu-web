export async function fetchGooglePlaceInfo(placeId: string) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    const location = data.result?.geometry?.location;

    if (!location) {
      throw new Error("Location 정보가 없습니다.");
    }

    return {
      location: {
        latitude: location.lat,
        longitude: location.lng,
      },
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
