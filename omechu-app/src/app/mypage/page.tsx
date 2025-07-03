"use client";

import Image from "next/image";
import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const router = useRouter();
  return (
    <>
      <Header
        className={"border-b-0"}
        rightChild={
          <button onClick={() => router.push("/mypage")}>
            <Image
              src={"/setting.png"}
              alt={"setting"}
              width={25}
              height={25}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center justify-start w-full h-full gap-10 px-8 py-10">
        <section className="flex flex-col items-center">
          <div className="my-4">
            <Image
              src={"/profile.png"}
              alt={"profile"}
              width={75}
              height={75}
            />
          </div>
          <div className="text-lg font-md font">제나</div>
          <div className="text-xs font-normal text-[#828282]">
            leej296@naver.com
          </div>
        </section>
        <section className="w-full border-2 bg-white rounded-md border-[#1F9BDA] text-[#00A3FF]">
          <button
            onClick={() => {
              router.push("/mypage/profileEdit");
            }}
            className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white"
          >
            <span className="pl-3 text-lg">프로필 관리</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
          <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
          <button
            onClick={() => {
              router.push("/mypage/userInfoSetup");
            }}
            className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white"
          >
            <span className="pl-3 text-lg">기본 상태 입력</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
          <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
          <button className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white">
            <span className="pl-3 text-lg">추천 목록 관리</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
          <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
          <button className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white">
            <span className="pl-3 text-lg">먹부림 일지</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
          <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
          <button className="flex justify-between items-center w-full px-4 pt-3 pb-2.5 hover:bg-[#dfc0e6] hover:text-white">
            <span className="pl-3 text-lg">활동 내역</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
          <div className="h-[0.1px] bg-[#b3d8eb] w-[calc(100%-2.5rem)] mx-auto" />
          <button className="flex justify-between items-center w-full px-4 pt-2.5 pb-3 hover:bg-[#dfc0e6] hover:text-white">
            <span className="pl-3 text-lg">찜 내역</span>
            <span className="pr-3">
              <Image
                src={"/right_arrow.svg"}
                alt={"rightArrow"}
                width={13}
                height={13}
              />
            </span>
          </button>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
