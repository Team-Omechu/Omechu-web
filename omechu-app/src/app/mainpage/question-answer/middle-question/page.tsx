"use client";

import { useRouter } from "next/navigation";

export default function MiddleQuestionPage() {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center justify-center w-full h-screen">
      <section className="flex flex-col items-center justify-center w-full h-full gap-5">
        <button
          onClick={() => {
            router.push("../");
          }}
          className="w-60 h-12 p-2 rounded-md border-[1px] text-xl bg-white text-red-500 border-red-500"
        >
          결과 바로 보기
        </button>
        <button
          onClick={() => {
            router.push("../meal-answer");
          }}
          className="w-60 h-12 p-2 rounded-md border-[1px] text-xl bg-white text-red-500 border-red-500"
        >
          추가 질문 응답하기
        </button>
      </section>
    </div>
  );
}
