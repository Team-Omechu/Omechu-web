"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import BottomNav from "../components/common/Bottom";
import SearchBar from "../components/common/SearchBar";

export default function FullMenu() {
  const router = useRouter();
  const foodItems = [
    "김치볶음밥", "콩나물 국밥", "비빔국수",
    "냉면", "우동", "야끼소바",
    "떡볶이", "햄버거", "순대국",
    "제육볶음", "불고기", "김치찌개"
  ];

  return (
    <>
      <main className="min-h-screen p-4">
        <SearchBar />

        <div className="flex justify-end gap-1 mt-4 text-sm border-b pb-1">
            <span className="font-semibold">추천순</span>
            <span>/</span>
            <span className="text-gray-500">최근 본 순</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
            {foodItems.map((food, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <div className="w-full aspect-square bg-gray-200 rouned-lg overflow-hidden">
                        <img
                            src={"/오메추-로고-보라색버전-모자4 1.png"}
                            alt={food}
                            className="w-full object-cover"
                        />
                    </div>
                    <span className="mt-1 text-center text-sm">{food}</span>
                </div>
            ))}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
