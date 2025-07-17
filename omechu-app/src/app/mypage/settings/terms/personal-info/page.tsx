"use client";

import { useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import FloatingActionButton from "@/app/components/common/FloatingActionButton";
import Header from "@/app/components/common/Header";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";

export default function TermForPersonalInfo() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        title={"개인정보 처리 방침"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main
        ref={mainRef}
        className="relative h-screen w-full overflow-scroll overflow-x-hidden px-7 py-9 scrollbar-hide"
      >
        {" "}
        {termsForPersonlInfo.map((item, key) => (
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
                item.index ? "text-[#828282]" : "text-black"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
        {/* Floating Action Button - 맨 위로 이동 */}
        <FloatingActionButton onClick={scrollToTop} />
      </main>
    </>
  );
}
