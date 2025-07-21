"use client";

import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";

export default function UserInfoSetupStartPage() {
  const router = useRouter();

  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={
          <button onClick={() => router.push("/mypage/user-info-edit")}>
            {"<"}
          </button>
        }
      />
      <main className="flex w-full flex-col items-center px-4 text-center">
        <section className="mb-24 mt-32 flex flex-col gap-5">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="whitespace-pre-line font-normal text-[#828282]">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
        </section>
        <section>
          <button
            onClick={() => router.push("/mypage/user-info-setup/1")}
            className="flex h-16 w-48 items-center justify-center rounded-md bg-[#FB4746] p-5 text-2xl font-medium text-white hover:bg-[#e2403f] active:bg-[#c93938]"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
