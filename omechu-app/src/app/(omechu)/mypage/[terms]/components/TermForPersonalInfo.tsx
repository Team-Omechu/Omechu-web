"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared";
import { termsForPersonalInfo } from "@/shared/constants/terms/data/personalInfo";

export default function TermForPersonalInfo() {
  const router = useRouter();
  return (
    <>
      <Header
        title="개인정보 처리방침"
        onBackClick={() => router.push("/mypage")}
        showHomeButton={false}
      />
      <main className="mt-6 h-full w-full px-7.5">
        {termsForPersonalInfo.map((item) => (
          <div key={item.index} className="">
            <span className="flex gap-0.5">
              <span>제</span>
              <span>{item.index}</span>
              <span>조</span>
              <span>({item.about})</span>
            </span>
            <div className="text-body-4-medium text-font-extralow mb-4 px-2 leading-6 whitespace-pre-line">
              {item.content}
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
