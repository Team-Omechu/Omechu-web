export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");

  if (!address) {
    return new Response(JSON.stringify({ error: "주소가 누락되었습니다." }), {
      status: 400,
    });
  }

  const apiKey = process.env.GOOGLE_MAP_SERVER_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address,
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "서버 오류", detail: err }), {
      status: 500,
    });
  }
}
