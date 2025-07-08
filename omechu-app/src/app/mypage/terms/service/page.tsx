"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

import { termsForService } from "@/app/constant/terms/service";

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
      <main className="w-full px-7 py-9">
        {termsForService.map((item, key) => (
          <section key={key} className="flex flex-col justify-start gap-1 mb-2">
            {/* 조항 번호, 제목 */}
            <div className="text-base font-bold">
              제 {item.index}조 ({item.about})
            </div>
            {/* 조항 내용 */}
            <div className="text-base font-normal text-[#828282] leading-relaxed">
              {item.content}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
