"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";

export default function TermForLocationInfo() {
  const router = useRouter();

  return (
    <>
      <Header
        title={"위치기반 서비스 이용약관"}
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
      <main className="w-full px-7 pt-7 pb-9">
        {termsForPersonlInfo.map((item, key) => (
          <section key={key} className="flex flex-col justify-start gap-1 mb-5">
            {/* 조항 번호, 제목 */}
            {item.index && (
              <div className="text-base font-bold">
                제 {item.index}조 ({item.about})
              </div>
            )}
            {/* 조항 내용 */}
            <div
              className={`text-base font-normal leading-relaxed ${
                item.index ? "text-[#828282]" : "text-black"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
