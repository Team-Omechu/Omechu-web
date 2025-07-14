"use client";

import { useRef } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import { termsForService } from "@/app/constant/terms/service";

export default function TermForService() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header
        title={"서비스 이용약관"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
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
        {termsForService.map((item, key) => (
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
        {/* FBA */}
        <section className="fixed bottom-4 left-1/2 z-10 -translate-x-1/2 transform">
          <button onClick={scrollToTop}>
            <Image src="/fba.png" alt="플로팅버튼" width={36} height={36} />
          </button>
        </section>
      </main>
    </>
  );
}
