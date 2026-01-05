"use client";

import React, { useState } from "react";

import { RandomDrawButton } from "@/shared_FSD/ui/button/RandomDrawButton";

export default function RandomDrawButtonTestPage() {
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});

  const handleToggle = (key: string) => {
    setSelectedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <main className="flex w-full flex-col items-center justify-center p-10">
      <h1 className="w-full">RandomDrawButton 컴포넌트 점검</h1>
      <section className="mt-10 flex w-full justify-between">
        {["한식", "중식", "일식", "양식", "그 외"].map((menu) => (
          <RandomDrawButton
            key={menu}
            width="sm"
            selected={!!selectedMap[menu]}
            onClick={() => handleToggle(menu)}
          >
            {menu}
          </RandomDrawButton>
        ))}
      </section>
      <hr className="border-font-disabled my-2 w-full border-[0.5px]" />
      <section className="flex w-full justify-between">
        {["밥", "먄", "고기", "해산물", "그 외"].map((menu) => (
          <RandomDrawButton
            key={menu}
            width="sm"
            selected={!!selectedMap[menu]}
            onClick={() => handleToggle(menu)}
          >
            {menu}
          </RandomDrawButton>
        ))}
      </section>
      <hr className="border-font-disabled my-2 w-full border-[0.5px]" />
      <section className="flex w-full gap-2">
        {["국물 있는 음식", "국물 없는 음식"].map((menu) => (
          <RandomDrawButton
            key={menu}
            width="md"
            selected={!!selectedMap[menu]}
            onClick={() => handleToggle(menu)}
          >
            {menu}
          </RandomDrawButton>
        ))}
      </section>
      <hr className="border-font-disabled my-2 w-full border-[0.5px]" />
      <section className="flex w-full gap-2">
        {["따뜻한 음식", "차가운 음식"].map((menu) => (
          <RandomDrawButton
            key={menu}
            width="md"
            selected={!!selectedMap[menu]}
            onClick={() => handleToggle(menu)}
          >
            {menu}
          </RandomDrawButton>
        ))}
      </section>
      <hr className="border-font-disabled my-2 w-full border-[0.5px]" />
      <section className="flex w-full gap-2">
        {["건강한 음식", "자극적인 음식"].map((menu) => (
          <RandomDrawButton
            key={menu}
            width="md"
            selected={!!selectedMap[menu]}
            onClick={() => handleToggle(menu)}
          >
            {menu}
          </RandomDrawButton>
        ))}
      </section>
    </main>
  );
}
