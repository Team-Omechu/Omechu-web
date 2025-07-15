"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="relative flex w-full justify-center">
      {/* 메인 배경 이미지 */}
      <Image
        src="/mainpage.png"
        alt="메인 페이지"
        width={375}
        height={732}
        className="mt-10 h-[40rem] w-[25.5625rem] object-cover"
      />
      {/* 버튼들 */}
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 transform gap-[0.625rem]">
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-[#FB4746] p-[1.25rem] text-white"
          onClick={() => router.push("mainpage/question-answer/meal-time")}
        >
          시작하기
        </button>
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-[#00A3FF]"
          onClick={() => router.push("mainpage/random")}
        >
          랜덤추천
        </button>
      </div>
    </div>
  );
}
