"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import InfoRow from "./InfoRow";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";

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
          <button onClick={() => router.push("/mypage")}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"back"}
              width={22}
              height={22}
            />
          </button>
        }
      />
      <main className="flex h-[calc(100dvh-3rem)] w-full flex-col items-center px-4 py-6">
        <div className="flex w-full flex-col items-center">
          <section className="mt-10">
            <div className="my-10 text-xl font-medium">
              {"<"} {nickname || "사용자"}의 기본 상태 {">"}
            </div>
          </section>
          <section className="mb-14 mt-10 flex w-full flex-col items-start justify-start gap-4 px-12">
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
            className="h-12 w-[340px] rounded-md bg-primary-normal text-[17px] font-medium text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
          >
            다시 입력하기
          </button>
        </section>
      </main>
    </>
  );
}
