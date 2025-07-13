"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Header from "@/app/components/common/Header";
import InfoRow from "@/app/components/mypage/InfoRow";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { indexToSlug } from "@/app/constant/UserInfoEditSteps";

export default function UserInfoEdit() {
  const router = useRouter();

  // Zustand 상태 가져오기
  const nickname = useOnboardingStore((state) => state.nickname);
  const gender = useOnboardingStore((state) => state.gender);
  const workoutStatus = useOnboardingStore((state) => state.workoutStatus);
  const preferredFood = useOnboardingStore((state) => state.preferredFood);
  const constitution = useOnboardingStore((state) => state.constitution);
  const allergies = useOnboardingStore((state) => state.allergies);

  return (
    <>
      <Header
        title={"기본 상태 입력"}
        leftChild={
          <button onClick={() => router.push("./")}>
            <Image
              src={"/header_left_arrow.png"}
              alt={"back"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="flex flex-col items-center w-full px-4 py-6 min-h-[calc(100vh-10rem)]">
        <div className="flex flex-col items-center w-full">
          <section>
            <div className="my-10 text-xl font-medium">
              {"<"} {nickname || "사용자"}의 기본 상태 {">"}
            </div>
          </section>
          <section className="flex flex-col items-start justify-start w-full gap-4 px-6 mt-5 mb-14">
            <InfoRow label="성별" content={gender || "None"} />
            <InfoRow label="운동 상태" content={workoutStatus || "None"} />
            <InfoRow
              label="선호 음식"
              content={preferredFood.length ? preferredFood : ["None"]}
            />
            <InfoRow
              label="체질"
              content={constitution.length ? constitution : ["None"]}
            />
            <InfoRow
              label="알레르기"
              content={allergies.length ? allergies : ["None"]}
            />
          </section>
        </div>

        <section>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[0]}`)
            }
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
