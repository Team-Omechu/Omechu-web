import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { cursor, limit } = req.query;
  const body = req.body;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/place?cursor=${cursor}&limit=${limit}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: req.headers.cookie || "", // 세션 쿠키 전달
      },
      body: JSON.stringify(body),
    },
  );

  const data = await response.json();
  res.status(200).json(data);
}
