"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";

export default function PlayPage() {
  const router = useRouter();
  const { roomId } = useParams();
  const searchParams = useSearchParams();
  const nickname = searchParams.get("name") ?? "참가자";

  // 메뉴 개수 (2~5 메뉴)
  const menus = [
    { name: "초밥", img: "/menu/salmon.png", color: "#F8D7DA" },
    { name: "샌드위치", img: "/menu/sandwich.png", color: "#FFF2C6" },
    { name: "타코", img: "/menu/taco.png", color: "#D9EAFD" },
    { name: "오므라이스", img: "/menu/omurice.png", color: "#CAF3D4" },
  ];

  const routerPush = (winner: string, menu: string) => {
    router.push(`/menubattle/result/${roomId}?winner=${winner}&menu=${menu}`);
  };

  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinRef = useRef<number | null>(null);

  const startSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    spinRef.current = requestAnimationFrame(rotate);
  };

  const rotate = () => {
    setAngle((prev) => prev + 5);
    spinRef.current = requestAnimationFrame(rotate);
  };

  const stopSpin = () => {
    if (!isSpinning) return;
    setIsSpinning(false);

    if (spinRef.current) cancelAnimationFrame(spinRef.current);

    const normalized = ((angle % 360) + 360) % 360;
    const sliceAngle = 360 / menus.length;
    const selectedIndex = Math.floor(normalized / sliceAngle);

    const selected = menus[selectedIndex];

    routerPush(nickname, selected.name);
  };

  return (
    <main className="min-h-screen bg-[#F7D8FF] pt-12 text-center">
      <h2 className="text-xl font-semibold">{roomId}</h2>
      <p className="mb-4 text-sm text-gray-600">&lt;참가자: 4명&gt;</p>

      <p className="mb-6 text-lg font-semibold">
        원하는 메뉴존의 타이밍에 맞춰 멈추세요!
      </p>

      <div className="relative mx-auto h-72 w-72">
        <div className="absolute -top-5 left-1/2 z-20 -translate-x-1/2">
          <div className="h-6 w-6 rounded-full border-4 border-white bg-[#FF7A9E] shadow-md"></div>
          <div className="mx-auto -mt-1 h-3 w-2 rounded-b-md bg-[#FF7A9E]"></div>
        </div>

        <svg
          width="100%"
          height="100%"
          viewBox="0 0 300 300"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: isSpinning ? "none" : "transform 0.3s ease-out",
          }}
          className="rounded-full"
        >
          <circle cx="150" cy="150" r="140" fill="white" />

          {menus.map((m, i) => {
            const sliceAngle = (360 / menus.length) * i;
            const largeArc = 360 / menus.length > 180 ? 1 : 0;

            const x1 = 150 + 140 * Math.cos((Math.PI / 180) * sliceAngle);
            const y1 = 150 + 140 * Math.sin((Math.PI / 180) * sliceAngle);

            const x2 =
              150 +
              140 *
                Math.cos((Math.PI / 180) * (sliceAngle + 360 / menus.length));
            const y2 =
              150 +
              140 *
                Math.sin((Math.PI / 180) * (sliceAngle + 360 / menus.length));

            return (
              <g key={i}>
                <path
                  d={`M150,150 L${x1},${y1} A140,140 0 ${largeArc} 1 ${x2},${y2} Z`}
                  fill={m.color}
                  stroke="white"
                  strokeWidth="2"
                />

                <text
                  x={150}
                  y={150 - 90} // 반지름 기준 위치
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="bold"
                  transform={`rotate(${sliceAngle + 360 / menus.length / 2},150,150)`}
                >
                  {m.name}
                </text>

                <image
                  href={m.img}
                  width="40"
                  height="40"
                  x={150 - 20}
                  y={150 - 60}
                  transform={`rotate(${sliceAngle + 360 / menus.length / 2},150,150)`}
                />
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FF7A9E] font-bold text-white shadow">
            START
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={startSpin}
          className="w-40 rounded-xl bg-[#FF7A9E] py-3 font-semibold text-white"
        >
          START
        </button>

        <button
          onClick={stopSpin}
          className="w-40 rounded-xl bg-red-400 py-3 font-semibold text-white"
        >
          STOP
        </button>
      </div>
    </main>
  );
}
