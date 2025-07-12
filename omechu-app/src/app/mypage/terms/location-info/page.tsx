"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/app/components/common/Header";
import { termsForLocationlInfo } from "@/app/constant/terms/locationInfo";

export default function TermForPersonalInfo() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        title={"개인정보 처리방침"}
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
      <main
        ref={mainRef}
        className="relative w-full h-screen overflow-scroll overflow-x-hidden scrollbar-hide px-7 py-9"
      >
        {termsForLocationlInfo.map((item, key) => (
          <section key={key} className="flex flex-col justify-start gap-1 mb-5">
            {/* 조항 번호, 제목 */}
            {item.index && (
              <div className="text-base font-bold">
                제 {item.index}조 ({item.about})
              </div>
            )}
            {/* 조항 내용 */}
            <div
              className={`text-base font-normal leading-relaxed whitespace-pre-wrap ${
                item.index ? "text-[#828282]" : "text-black"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
        {/* FBA */}
        <section className="fixed z-10 transform -translate-x-1/2 bottom-4 left-1/2">
          <button onClick={scrollToTop}>
            <Image src="/fba.png" alt="플로팅버튼" width={36} height={36} />
          </button>
        </section>
      </main>
    </>
  );
}
