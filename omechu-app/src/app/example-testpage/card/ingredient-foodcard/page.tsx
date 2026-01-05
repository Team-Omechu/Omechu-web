"use client";

import { useState } from "react";

import IngredientCard from "@/shared_FSD/ui/card/IngredientCard";

const mockMenus = {
  kcal: "520",
  carbohydrate: "40",
  protein: "32",
  fat: "28",
  vitamin: "비타민 C 12mg",
  allergies: "연어, 대두, 글루텐",
};

export default function IngredientCardTestPage() {
  const [log, setLog] = useState("");

  const handleClick = () => {
    const msg = `Card clicked at ${new Date().toLocaleTimeString()}`;
    setLog(msg);
    console.log(msg);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div>
        <IngredientCard {...mockMenus} onCardClick={handleClick} />
      </div>

      {log && (
        <p className="text-caption-2-regular text-font-medium mt-6">{log}</p>
      )}
    </main>
  );
}
