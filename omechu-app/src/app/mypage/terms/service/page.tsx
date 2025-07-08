"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function ServiceTerm() {
  const router = useRouter();

  return (
    <>
      <Header
        title={"서비스 이용 약관"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage/terms");
            }}
          >
            {"<"}
          </button>
        }
      />

      <main className="w-full px-7 py-9 ">
        <section className="flex flex-col justify-start gap-1 mb-3">
          {/* 조항 번호 */}
          <div className="text-base font-bold">제 1조</div>
          {/* 조항 내용 */}
          <div className="text-base font-normal text-[#828282] leading-relaxed">
            내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용
            내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용
            내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용
            내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용
            내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용 내용
            내용
          </div>
        </section>
      </main>
    </>
  );
}
