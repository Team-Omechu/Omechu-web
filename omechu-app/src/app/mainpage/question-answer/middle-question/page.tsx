"use client";

import { useRouter } from "next/navigation";

export default function MiddleQuestionPage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-row items-center justify-center">
      <section className="flex h-full w-full flex-col items-center justify-center gap-5">
        <button
          onClick={() => {
            router.push("../");
          }}
          className="h-12 w-60 rounded-md border-[1px] border-red-500 bg-white p-2 text-xl text-red-500"
        >
          결과 바로 보기
        </button>
        <button
          onClick={() => {
            router.push("../meal-answer");
          }}
          className="h-12 w-60 rounded-md border-[1px] border-red-500 bg-white p-2 text-xl text-red-500"
        >
          추가 질문 응답하기
        </button>
      </section>
    </div>
  );
}
