"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Header from "@/app/components/common/Header";
import Image from "next/image";
import FoodBox from "@/app/components/mypage/FoodBox";

export default function RecommendedList() {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0); // 0: 추천 목록, 1: 제외 목록
  const [selectedAlphabetIndex, setSelectedAlphabetIndex] = useState<
    number | undefined
  >(undefined); // 0~13, 0: 'ㄱ', 13: 'ㅎ'

  return (
    <>
      <Header
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            {"<"}
          </button>
        }
        title={"추천 목록 관리"}
      />

      {/* Main */}
      <main className="px-4 gap-3 flex flex-col items-center w-full min-h-[calc(100vh-10rem)]">
        {/* 리스트 선택  */}
        <section className="flex w-full ">
          {["추천 목록", "제외 목록"].map((item, index) => (
            <button
              onClick={() => {
                setSelectedIndex(index);
              }}
              key={index}
              className={`w-44 h-12 text-lg font-medium ${
                selectedIndex === index
                  ? "text-white border-black border-b-[3px] bg-[#1f9bda]"
                  : "text-[#828282] border-b-[#828282] border-b-2 bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        {/* 검색 창 */}
        <section className="relative">
          <input
            type="text"
            placeholder="음식명을 검색하세요."
            className="px-6 flex items-center bg-white w-[340px] h-10 border-2 border-black rounded-3xl"
          />
          <Image
            onClick={() => {}}
            className="absolute z-10 top-1.5 right-4 cursor-pointer"
            src={"/search.png"}
            alt="검색"
            width={25}
            height={25}
          />
        </section>

        {/* 인덱스  */}
        <section>
          <div
            className="w-[340px] h-[61px] px-7 py-2 grid grid-cols-7 grid-flow-dense
                      bg-white border-2 border-black  rounded-2xl"
          >
            {[
              "ㄱ",
              "ㄴ",
              "ㄷ",
              "ㄹ",
              "ㅁ",
              "ㅂ",
              "ㅅ",
              "ㅇ",
              "ㅈ",
              "ㅊ",
              "ㅋ",
              "ㅌ",
              "ㅍ",
              "ㅎ",
            ].map((item, index) => (
              <button
                className={`text-[15px] text-[text-#393939] font-normal hover:bg-[#e2e2e2] active:bg-[#828282] rounded-full 
                  ${selectedAlphabetIndex === index ? "font-black" : ""}`}
                onClick={() => setSelectedAlphabetIndex(index)}
                key={index}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 추천 목록 리스트 */}
        <section className="grid grid-cols-3 gap-4">
          <FoodBox title={"Chocolate"} />
        </section>
      </main>

      {/* footer */}
      <footer>
        <button></button>
      </footer>
    </>
  );
}
