"use client";

import { PlayerResult } from "@/entities/menubattle/model/types";

export function ResultPanel({ results }: { results: PlayerResult[] }) {
  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => {
    if (a.diff !== b.diff) return a.diff - b.diff;
    return a.stoppedAt - b.stoppedAt;
  });

  const winner = sorted[0];

  return (
    <section className="mt-8 px-6">
      <div className="rounded-2xl border-2 border-[#FF7A9E] bg-white p-4">
        <p className="text-lg font-bold">🥇 우승자 {winner.name}</p>
        <p className="text-sm text-gray-600">오늘의 메뉴는 {winner.menu}!</p>
      </div>

      <ul className="mt-4 space-y-3">
        {sorted.map((r, i) => (
          <li
            key={r.name}
            className="flex justify-between rounded-xl bg-white px-4 py-3"
          >
            <span>
              {i + 1}. {r.name} ({r.menu})
            </span>
            <span>{r.diff}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
