"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/app/components/common/Header";

export default function UserInfoSetupStartPage() {
  const router = useRouter();

  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={
          <button onClick={() => router.push("./user-info-edit")}>
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center w-full px-4 text-center">
        <section className="flex flex-col gap-5 mt-32 mb-24">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="whitespace-pre-line font-normal text-[#828282]">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
        </section>
        <section>
          <button
            onClick={() => router.push("/mypage/user-info-setup/1")}
            className="w-48 h-16 p-5 flex items-center justify-center
                      text-white text-2xl font-medium rounded-md 
                      bg-[#FB4746] hover:bg-[#e2403f] active:bg-[#c93938]"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
