"use client";

import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

const userInfo: {
  name: string;
  gender: string;
  state: string;
  food: string[];
  condition: string[];
  allergy: string[];
}[] = [
  {
    name: "이달",
    gender: "None",
    state: "다이어트 중",
    food: ["한식", "다른나라"],
    condition: ["추위를 잘 타요"],
    allergy: ["갑각류"],
  },
];

export default function UserInfoEdit() {
  const router = useRouter();
  return (
    <>
      <Header
        title={"기본 상태 입력"}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            {"<"}
          </button>
        }
      />
      <main className="flex flex-col items-center w-full min-h-100dvh px-4 py-6 min-h-[calc(100vh-10rem)]">
        {userInfo.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <section>
              <div className="my-10 text-xl font-medium">
                {"<"} {item.name}의 기본 상태 {">"}
              </div>
            </section>
            <section className="flex flex-col items-start justify-start w-full gap-3 px-6 mt-5 mb-10">
              <div className="flex items-start gap-6">
                <div
                  className="w-32 h-9 px-1 justify-center items-center
                            bg-[#F5F5F5] dark:bg-[#7a7a7a]
                            border-[1px] border-[#393939]
                            flex  rounded-md"
                >
                  성별
                </div>
                <div className="flex-1 mt-1.5 text-[#828282] text-base font-normal">
                  {item.gender}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
                  운동 상태
                </div>
                <div className="flex-1 mt-1.5 text-[#393939] text-base font-normal">
                  {item.state}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
                  선호 음식
                </div>
                <div className="flex-1 mt-1.5 max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
                  {item.food}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
                  체질
                </div>
                <div className="flex-1 mt-1.5 max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
                  {item.condition}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-32 h-9 bg-[#F5F5F5] flex items-center justify-center rounded-md px-1 py-1 border-[1px] border-[#393939]">
                  알레르기
                </div>
                <div className="flex-1 mt-1.5  max-h-32 overflow-y-scroll text-[#393939] text-base font-normal">
                  {item.allergy}
                </div>
              </div>
            </section>
          </div>
        ))}

        <section>
          <button
            onClick={() => router.push("/mypage/user-info-setup")}
            className="w-[335px] h-[45px] bg-[#fb4746] hover:bg-[#e2403f] rounded-md active:bg-[#c93938] text-white text-[17px] font-medium"
          >
            다시 입력하기
          </button>
        </section>
      </main>
    </>
  );
}
