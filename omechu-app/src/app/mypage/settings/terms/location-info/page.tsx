/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";

import { useRouter } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import Header from "@/components/common/Header";
import { termsForLocationInfo } from "@/constant/terms/locationInfo";

export default function TermForLocationInfo() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        title={"위치기반 서비스 이용약관"}
        leftChild={
          <button
            onClick={() => {
              router.back();
            }}
          >
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main
        ref={mainRef}
        className="relative h-[calc(100dvh-3rem)] w-full overflow-scroll overflow-x-hidden px-7 py-9 scrollbar-hide"
      >
        {termsForLocationInfo.map((item, key) => (
          <section key={key} className="mb-5 flex flex-col justify-start gap-1">
            {/* 조항 번호, 제목 */}
            {item.index && (
              <div className="text-base font-bold">
                제 {item.index}조 ({item.about})
              </div>
            )}
            {/* 조항 내용 */}
            <div
              className={`whitespace-pre-wrap text-base font-normal leading-relaxed ${
                item.index ? "text-grey-normalActive" : "text-[#393939]"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
        {/* Floating Action Button - 맨 위로 이동 */}
        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />
      </main>
    </>
  );
}
