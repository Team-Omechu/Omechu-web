"use client";

import { useState } from "react";

import { Player, PlayerResult, Menu, ResultPanel } from "@/entities/menubattle";
import { BattleBoard, Roulette } from "@/widgets/menubattle";

export default function PlayPage() {
  /* ================= MOCK ================= */

  const players: Player[] = [
    { id: "1", name: "제나", joinedAt: 1 },
    { id: "2", name: "이달", joinedAt: 2 },
    { id: "3", name: "이삭", joinedAt: 3 },
    { id: "4", name: "리본", joinedAt: 4 },
  ];

  const menus: Menu[] = [
    { name: "사케동", centerAngle: 0 },
    { name: "샌드위치", centerAngle: 90 },
    { name: "타코", centerAngle: 180 },
    { name: "오므라이스", centerAngle: 270 },
  ];

  const currentPlayer = players[2]; // 이삭
  const isHost = currentPlayer.id === players[0].id;

  /* ================= STATE ================= */

  const [results, setResults] = useState<PlayerResult[]>([]);
  const [finished, setFinished] = useState(false);

  /* ================= LOGIC ================= */

  const handleStop = (angle: number) => {
    // 이미 멈춘 사람은 무시
    if (results.some((r) => r.name === currentPlayer.name)) return;

    const calculated = menus.map((menu) => {
      const diff = Math.abs(angle - menu.centerAngle);
      return { menu: menu.name, diff };
    });

    const best = calculated.sort((a, b) => a.diff - b.diff)[0];

    setResults((prev) => [
      ...prev,
      {
        playerId: currentPlayer.id,
        name: currentPlayer.name,
        menu: best.menu,
        diff: best.diff,
        stoppedAt: Date.now(),
      },
    ]);
  };

  /* ================= RENDER ================= */

  return (
    <main className="min-h-screen bg-[#F7D8FF] px-4 pt-12 text-center">
      <BattleBoard players={players} />

      <Roulette onStop={handleStop} disabled={finished} />

      {isHost && !finished && (
        <button
          onClick={() => setFinished(true)}
          className="mt-6 rounded-xl bg-[#FF7A9E] px-8 py-3 text-white"
        >
          배틀 마감하기
        </button>
      )}

      {finished && <ResultPanel results={results} />}
    </main>
  );
}
