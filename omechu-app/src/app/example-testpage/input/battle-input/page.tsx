"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { BattleInput } from "@/shared_FSD/ui/input/BattleInput";

export default function BattleInputTestPage() {
  const [value, setValue] = useState("");
  const [state, setState] = useState<"default" | "search">("default");
  const router = useRouter();

  const handleSearch = () => {
    console.log("검색 실행됨:", value);
  };

  return (
    <main className="mt-10 flex h-fit w-full flex-col items-center">
      <div className="flex w-full flex-col gap-2"></div>
      <BattleInput width="default" />
      <BattleInput width="default" type="search" />
    </main>
  );
}
