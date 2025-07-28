"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function MainPage() {
  const router = useRouter();

  return (
    <div className="relative flex h-[calc(100dvh-4.7rem)] w-full justify-center overflow-hidden">
      {/* 메인 배경 이미지 */}
      <Image
        src="/mainpage/mainpage.svg"
        alt="메인 페이지"
        width={375}
        height={800}
        className="h-full w-full object-cover"
      />
      {/* 버튼들 */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 transform gap-4">
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] bg-primary-normal p-[1.25rem] text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
          onClick={() => router.push("mainpage/question-answer/1")}
        >
          <span className="pt-1">시작하기</span>
        </button>
        <button
          className="flex h-[2.8125rem] w-[9.0625rem] flex-shrink-0 items-center justify-center gap-[0.625rem] rounded-[0.375rem] border border-[#00A3FF] bg-[#FFF] p-[1.25rem] text-[#00A3FF] hover:bg-secondary-lightHover hover:text-white active:bg-secondary-lightActive active:text-white"
          onClick={() => router.push("mainpage/random-recommend")}
        >
          <span className="pt-1">랜덤추천</span>
        </button>
      </div>
    </div>
  );
}
