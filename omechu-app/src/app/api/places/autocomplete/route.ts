// app/api/places/autocomplete/route.ts
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input");
    const sessiontoken =
      searchParams.get("sessiontoken") ?? crypto.randomUUID();

    if (!input || input.trim().length < 1) {
      return new Response(JSON.stringify({ predictions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const key = process.env.GOOGLE_MAP_SERVER_API_KEY;
    const url = new URL(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
    );
    url.searchParams.set("input", input);
    url.searchParams.set("key", String(key));
    url.searchParams.set("language", "ko");
    url.searchParams.set("sessiontoken", sessiontoken);
    // 한국 위주 검색 시 아래 2줄 권장
    url.searchParams.set("components", "country:kr");
    url.searchParams.set("types", "geocode");

    const r = await fetch(url.toString());
    const data = await r.json();

    return new Response(JSON.stringify({ ...data, sessiontoken }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Autocomplete failed", detail: String(e) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
