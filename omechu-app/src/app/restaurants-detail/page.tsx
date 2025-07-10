"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import Header from "../components/common/Header";

const restaurant_time_table = [
  {
    days_of_the_week: "월",
    time: "휴일",
  },
  {
    days_of_the_week: "화",
    time: "11:00 - 19:00",
  },
  {
    days_of_the_week: "수",
    time: "11:00 - 19:00",
  },
  {
    days_of_the_week: "목",
    time: "11:00 - 19:00",
  },
  {
    days_of_the_week: "금",
    time: "11:00 - 19:00",
  },
  {
    days_of_the_week: "토",
    time: "11:00 - 19:00",
  },
  {
    days_of_the_week: "일",
    time: "11:00 - 19:00",
  },
];

export default function RestaurantsDetial() {
  const pathname = usePathname();
  const router = useRouter();

  const [showAddress, setShowAddress] = useState(false);
  const [rating, setRating] = useState(0); // 0~5점
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      {/* 헤더 */}
      <Header
        className="border-none"
        title={""}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      {/* 메인 Container*/}
      <main className="relative overflow-y-auto px-4 gap-3 flex flex-col items-center w-full min-h-[calc(100vh-10rem)]">
        {/* 맛집 제목, 사진 */}
        <section className="flex flex-col items-center justify-between w-full gap-2 mt-3">
          <h1 className="text-2xl font-bold text-[#1F9BDA] text-center">
            오레노 라멘 합정 본점 ❤️
          </h1>
          <div className="flex w-full gap-3 px-4 py-2 overflow-x-auto">
            {[...Array(4)].map((_, idx) => (
              <Image
                key={idx}
                src="/restaurant_blank.png"
                alt={`맛집 사진 ${idx + 1}`}
                width={180}
                height={180}
                className="rounded-lg shrink-0"
              />
            ))}
          </div>
        </section>
        {/* 맛집 정보 */}
        <section
          className="relative flex flex-col items-center w-full p-4
        rounded-md border-[1px] border-[#393939] bg-white gap-3"
        >
          {/* 정보 - 메뉴 종류 */}
          <div className="flex items-center justify-start w-full gap-3">
            <Image
              src="/food_menu.png"
              alt="맛집 메뉴"
              width={24}
              height={24}
            />
            <span className="mt-1 text-lg font-bold text-[#1F9BDA] text-center">
              라멘
            </span>
          </div>
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[1px] opacity-60"></div>
          {/* 맛집 시간표 */}
          <div className="flex flex-row justify-start w-full gap-5">
            <div className="flex-shrink-0">
              <Image
                className="flex-shrink-0"
                src="/restaurant_time_table.png"
                alt="맛집 시간표"
                width={24}
                height={24}
              />
            </div>
            <div>
              {restaurant_time_table.map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <h1 className="text-lg font-normal text-[#393939] text-center">
                    {item.days_of_the_week}
                  </h1>
                  <span className="text-base font-normal text-[#828282]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[1px] opacity-60"></div>
          {/* 주소 */}
          <div className="flex flex-1 gap-3">
            <div className="flex-shrink-0">
              <Image
                className="flex-shrink-0 mb-2"
                src="/restaurant_location.png"
                alt="맛집 위치"
                width={24}
                height={24}
              />
            </div>
            <div className="relative flex flex-col w-full gap-3 mt-1">
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                  도로명
                </span>
                <span className="text-sm  font-normal text-[#828282] whitespace-pre-wrap">
                  서울 성동구 왕십리로 36 104호
                </span>
              </div>
              {showAddress && (
                <>
                  <div className="flex items-start gap-1">
                    <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                      지번
                    </span>
                    <span className="text-sm  font-normal text-[#828282] whitespace-pre-wrap">
                      서울 성동구 성수동 123-1 1층
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                      우편번호
                    </span>
                    <span className="text-sm  font-normal text-[#828282] whitespace-pre-wrap">
                      12345
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="z-10">
              <button
                onClick={() => {
                  setShowAddress((prev) => !prev);
                }}
              >
                <Image
                  src={showAddress ? "/arrow_up.png" : "/arrow_down.png"}
                  alt="상세주소 보기"
                  width={30}
                  height={30}
                />
              </button>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={() => router.push(`${pathname}/map?id=1`)}
              className="flex flex-col justify-center items-center w-16 h-6 bg-[#1F9BDA] rounded-3xl"
            >
              <span className="mt-1 text-sm font-normal text-white">
                지도보기
              </span>
            </button>
          </div>
        </section>

        {/* 후기 작성 칸 */}
        <section className="flex flex-col items-center w-full gap-5 mt-5">
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[2px] opacity-40" />
          {/* 별 후기 작성 */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const score = index + 1;
                return (
                  <button
                    key={score}
                    onClick={() => setRating(score)}
                    className="text-3xl text-[#1F9BDA] w-fit h-fit"
                  >
                    {score <= rating ? "★" : "☆"}
                  </button>
                );
              })}
            </div>
            <span className="text-[#828282] font-normal text-base">
              후기를 남겨주세요!
            </span>
          </div>
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[2px] opacity-40" />
        </section>

        {/* 후기 */}
        <section className="flex flex-col w-full gap-2">
          <div className="flex justify-between px-2 py-2">
            {/* 후기 평점 - 후기 개수 */}
            <div className="flex gap-2 text-[#1F9BDA] text-xl font-medium">
              <span>3.2</span>
              <span>★★★☆☆</span>
            </div>
            <div className="flex gap-1 text-[#828282] text-base font-medium">
              <span>후기</span>
              <span className="font-bold">24</span>
              <span>건</span>
            </div>
          </div>

          {/* 후기 관련 태그 */}
          <div className="flex flex-wrap justify-center gap-1 px-4">
            {[
              "저녁식사(16)",
              "혼밥(12)",
              "조용한(9)",
              "저녁식사(16)",
              "혼밥(12)",
              "조용한(9)",
              "혼밥(12)",
              "조용한(9)",
              "저녁식사(16)",
              "혼밥(12)",
              "혼밥(12)",
              "조용한(9)",
            ].map((item, index) => (
              <div
                key={index}
                className="mt-1 px-4 py-1 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-nomal hover:scale-105 duration-300"
              >
                {item}
              </div>
            ))}
          </div>

          {/* 후기 카드 목록 */}
          <div className="flex flex-col w-full gap-3 mt-5">
            <div className="flex justify-end gap-2 mr-2 text-sm font-normal">
              <button
                className={isActive ? "text-[#393939]" : "text-[#828282]"}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                추천 순
              </button>
              <span>|</span>
              <button
                className={isActive ? "text-[#828282]" : "text-[#393939]"}
                onClick={() => {
                  setIsActive((prev) => !prev);
                }}
              >
                최신 순
              </button>
            </div>
            <div></div>
          </div>
        </section>
      </main>
    </>
  );
}
