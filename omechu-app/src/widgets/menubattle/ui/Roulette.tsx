"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import Image from "next/image";

export interface RouletteHandle {
  start: () => void;
  stop: () => void;
  getAngle: () => number;
}

type RouletteProps = {
  menus: {
    menuId: string;
    menuName: string;
    centerAngle: number;
    color: string;
  }[];
  disabled?: boolean;
};

export const Roulette = forwardRef<RouletteHandle, RouletteProps>(
  ({ menus, disabled = false }, ref) => {
    const [spinning, setSpinning] = useState(false);
    const [angle, setAngle] = useState(0); // ✅ 렌더용 state
    const angleRef = useRef(0); // ✅ 서버 전송용 ref

    useImperativeHandle(ref, () => ({
      start: () => setSpinning(true),
      stop: () => setSpinning(false),
      getAngle: () => angleRef.current,
    }));

    useEffect(() => {
      if (!spinning || disabled) return;

      const id = setInterval(() => {
        setAngle((prev) => {
          const next = (prev + 4) % 360;
          angleRef.current = next; // 🔥 항상 동기화
          return next;
        });
      }, 16);

      return () => clearInterval(id);
    }, [spinning, disabled]);

    const toRad = (deg: number) => (deg * Math.PI) / 180;

    return (
      <div className="relative flex flex-col items-center">
        {/* 🔵 전체 영역 (텍스트 포함) */}
        <div className="relative h-100 w-100">
          {/* 1️⃣ 메뉴 텍스트 (바깥) */}
          <svg
            className="pointer-events-none absolute inset-0 z-10"
            viewBox="-200 -200 400 400"
          >
            {menus.map((m) => {
              const r = 180; // 룰렛(160)보다 큼
              const rad = toRad(m.centerAngle - 90);
              return (
                <text
                  key={m.menuId}
                  x={Math.cos(rad) * r}
                  y={Math.sin(rad) * r}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="13"
                  fill="#333"
                >
                  {m.menuName}
                </text>
              );
            })}
          </svg>

          {/* 실제 룰렛 영역 */}
          <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2">
            {/* 2️⃣ 메뉴 컬러 막대 */}
            <svg className="absolute inset-0 z-20" viewBox="-160 -160 320 320">
              {menus.map((m) => {
                const rad = toRad(m.centerAngle - 90);
                return (
                  <line
                    key={m.menuId}
                    x1={Math.cos(rad) * 40}
                    y1={Math.sin(rad) * 40}
                    x2={Math.cos(rad) * 150}
                    y2={Math.sin(rad) * 150}
                    stroke={m.color}
                    strokeWidth={15}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* 3️⃣ 룰렛 이미지 */}
            <Image
              src="/menubattle/roulette.svg"
              alt="roulette"
              fill
              priority
            />

            {/* 회전 레이어 */}
            <div
              className="absolute inset-0 z-30 flex items-center justify-center"
              style={{
                transform: `rotate(${angle - 90}deg)`,
                transformOrigin: "50% 50%",
              }}
            >
              <div
                className="w-2 rounded border border-white bg-[#FF7A9E]"
                style={{
                  height: 160,
                  transform: "translateY(-80px)",
                  transformOrigin: "bottom",
                }}
              />
            </div>

            {/* 5️⃣ 중앙 원 */}
            <div className="absolute top-1/2 left-1/2 z-40 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF7A9E]" />
          </div>
        </div>
      </div>
    );
  },
);

Roulette.displayName = "Roulette";
