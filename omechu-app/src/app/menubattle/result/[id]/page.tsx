/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useSearchParams, useParams } from "next/navigation";

export default function ResultPage() {
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const winner = searchParams.get("winner") || "참가자";
  const menu = searchParams.get("menu") || "메뉴";

  return (
    <main className="min-h-screen bg-[#F7D8FF] px-6 pt-16 text-center">
      <h2 className="mb-6 text-xl font-semibold">{roomId}</h2>
      <p className="mb-10 text-sm text-gray-600">&lt;참가자: 4명&gt;</p>

      <h3 className="mb-6 text-lg font-semibold">게임 결과</h3>

      <div className="relative mx-auto mt-4 h-64 w-64 rounded-full border-[14px] border-white">
        <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
          {menu}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-xl border-2 border-[#FF7A9E] bg-white p-5 shadow">
        <div className="flex items-center justify-between">
          <div className="text-left">
            <p className="text-lg font-bold">🥇 우승자 : {winner}</p>
            <p className="mt-1 text-gray-600">오늘의 메뉴는 {menu}!</p>
          </div>

          <img src="/logo/logo.png" className="h-12 w-12" />
        </div>
      </div>
    </main>
  );
}
