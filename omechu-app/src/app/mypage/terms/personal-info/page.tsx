"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import { termsForPersonlInfo } from "@/app/constant/terms/personlInfo";

export default function TermForLocationInfo() {
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              className={`text-base font-normal leading-relaxed whitespace-pre-wrap ${
                item.index ? "text-[#828282]" : "text-black"
              }`}
            >
              {item.content}
            </div>
          </section>
        ))}
        {/* FAB */}
        <section className="fixed z-10 transform -translate-x-1/2 bottom-4 left-1/2">
          <button onClick={scrollToTop}>
            <Image src="/fba.png" alt="플로팅버튼" width={36} height={36} />
          </button>
        </section>
      </main>
    </>
  );
}
