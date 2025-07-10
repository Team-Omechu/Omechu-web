"use client";

import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="w-full flex justify-center">
      <div className="relative">
        {/* 메인 배경 이미지 */}
        <img
          src="/mainpage.png"
          alt="메인 페이지"
          className="w-[25.5625rem] h-[38.375rem] object-cover mt-10"
        />
        <img
          src="/오메추-로고-보라색버전-모자4 1.png"
          alt="오메추 로고"
          className="
            absolute
            top-[6.5rem] left-1/2
            transform -translate-x-1/2 -translate-y-1/2
            w-[17rem]
            h-[10rem]
            flex-shrink-0"
        />

        {/* 버튼들 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-[0.625rem]">
          <button
            className="flex w-[9.0625rem] h-[2.8125rem] p-[1.25rem] justify-center items-center gap-[0.625rem] flex-shrink-0 rounded-[0.375rem] bg-[#FB4746] text-white"
            onClick={() => router.push("mainpage/question-answer/meal-time")}
          >
            시작하기
          </button>
          <button
            className="flex w-[9.0625rem] h-[2.8125rem] p-[1.25rem] justify-center items-center gap-[0.625rem] flex-shrink-0 rounded-[0.375rem] bg-[#FFF] text-[#00A3FF] border border-[#00A3FF]"
            onClick={() => router.push("mainpage/random")}
          >
            랜덤추천
          </button>
        </div>
      </div>
    </div>
  );
}
