"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/app/components/common/Header";
import InfoRow from "@/app/components/mypage/InfoRow";

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
    condition: ["추위를 잘 타요", "속이 자주 더부룩해요"],
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
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-10rem)]">
        {userInfo.map((item, index) => (
          <div key={index} className="flex flex-col items-center w-full">
            <section>
              <div className="my-10 text-xl font-medium">
                {"<"} {item.name}의 기본 상태 {">"}
              </div>
            </section>
            <section className="flex flex-col items-start justify-start w-full gap-4 px-6 mt-5 mb-14">
              <InfoRow label="성별" content={item.gender} />
              <InfoRow label="운동 상태" content={item.state} />
              <InfoRow label="선호 음식" content={item.food} />
              <InfoRow label="체질" content={item.condition} />
              <InfoRow label="알레르기" content={item.allergy} />
            </section>
          </div>
        ))}
        <section>
          <button
            onClick={() => router.push("/mypage/user-info-setup")}
            className="w-[335px] h-[45px] text-[17px] 
                      font-medium text-white rounded-md
                      bg-[#fb4746] dark:bg-[#bc3535]
                      hover:bg-[#e2403f] dark:hover:bg-[#972b2a]
                      active:bg-[#c93938] dark:active:bg-[#71201f]"
          >
            다시 입력하기
          </button>
        </section>
      </main>
    </>
  );
}
