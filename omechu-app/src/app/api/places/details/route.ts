// app/api/places/details/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get("placeId");
    const sessiontoken = searchParams.get("sessiontoken") ?? undefined;

    if (!placeId) {
      return new Response(JSON.stringify({ error: "placeId required" }), {
        status: 400,
      });
    }

    const key = process.env.GOOGLE_MAP_SERVER_API_KEY;
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/details/json",
    );
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("key", String(key));
    url.searchParams.set("language", "ko");
    if (sessiontoken) url.searchParams.set("sessiontoken", sessiontoken);
    // 필요한 필드만
    url.searchParams.set(
      "fields",
      [
        "formatted_address",
        "geometry/location",
        "name",
        "address_components",
        "place_id",
      ].join(","),
    );

    const r = await fetch(url.toString());
    const data = await r.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Details failed", detail: String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
