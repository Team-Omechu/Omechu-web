"use client";

import { useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const searchParams = useSearchParams();

  const battleName = searchParams.get("battleName") || "배틀방";

  const [nickname, setNickname] = useState("");

  return (
    <main className="flex min-h-screen flex-col justify-center bg-[#F7D8FF] px-6">
      <div className="rounded-2xl border bg-white p-6 text-center shadow-lg">
        <h2 className="mb-2 text-xl font-bold">[{battleName}]</h2>

        <p className="mb-4 text-gray-600">
          닉네임을 입력하고 게임에 참여하세요
        </p>

        <input
          className="mb-4 w-full rounded-xl border px-4 py-3 outline-none"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <button
          className="w-full rounded-xl bg-[#FF7A9E] py-3 text-white"
          disabled={!nickname.trim()}
          onClick={() =>
            router.push(
              `/menubattle/play/${roomId}?name=${nickname}&battleName=${encodeURIComponent(
                battleName,
              )}`,
            )
          }
        >
          입장하기
        </button>
      </div>
    </main>
  );
}
