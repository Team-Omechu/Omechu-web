"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function UserInfoEdit() {
  const router = useRouter();
  return (
    <>
      <Header
        title={"기본 상태 입력"}
        leftChild={
          <button
            onClick={() => {
              router.back();
            }}
          >
            {"<"}
          </button>
        }
      />
      <main className="flex flex-col items-center gap-5 justify-around w-full px-4 py-6 min-h-[calc(100vh-10rem)]">
        <section>
          <div className="text-lg font-medium">
            {"<"} 이달의 기본 상태 {">"}
          </div>
        </section>
        <section className="flex flex-col gap-3 px-5">
          <div className="flex items-start gap-4">
            <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
              성별
            </div>
            <div className="flex-1 mt-1.5 text-[#828282] text-base font-normal">
              None
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
              운동 상태
            </div>
            <div className="flex-1 mt-1.5 text-[#393939] text-base font-normal">
              다이어트 중
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
              선호 음식
            </div>
            <div className="flex-1 mt-1.5 max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
              한식 다른나라
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
              체질
            </div>
            <div className="flex-1 mt-1.5 max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
              추위를 잘 타고 몸이 쉽게 차가워져요. 추위를 잘 타고 몸이 쉽게
              차가워져요추위를 잘 타고 몸이 쉽게 차가워져요추위를 잘 타고 몸이
              쉽게 차가워져요추위를 잘 타고 몸이 쉽게 차가워져요
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
              알레르기
            </div>
            <div className="flex-1 mt-1.5  max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
              갑각류 알레르기
            </div>
          </div>
        </section>
        <section>
          <button
            onClick={() => router.push("/mypage/userInfoSetup")}
            className="w-[335px] h-[45px] bg-[#fb4746] hover:bg-[#e2403f] rounded-md active:bg-[#c93938] text-white text-[17px] font-medium"
          >
            다시 입력하기
          </button>
        </section>
      </main>
    </>
  );
}
