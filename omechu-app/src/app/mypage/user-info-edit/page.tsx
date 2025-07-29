"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import InfoRow from "./InfoRow";
import { indexToSlug } from "@/constant/UserInfoEditSteps";
import { useOnboardingStore } from "@/lib/stores/onboarding.store";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api/client";

type ProfileType = {
  nickname: string;
  gender?: string;
  workoutStatus?: string;
  preferredFood: string[];
  constitution: string[];
  allergies: string[];
};

export default function UserInfoEdit() {
  const router = useRouter();
  const userId = 1;
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState(""); // 오류 메시지 상태 추가

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiClient.get(`/profile/${userId}`);
        setProfile(res.data.success);
      } catch (err) {
        const error = err as any;
        if (error.response?.status === 401) {
          setError("로그인이 필요합니다.");
        } else {
          setError("프로필을 불러오지 못했습니다.");
        }
      }
    }
    fetchProfile();
  }, [router, userId]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (!profile) return <div>로딩 중...</div>;

  // Zustand 상태 가져오기
  // const nickname = useOnboardingStore((state) => state.nickname);
  // const gender = useOnboardingStore((state) => state.gender);
  // const workoutStatus = useOnboardingStore((state) => state.workoutStatus);
  // const preferredFood = useOnboardingStore((state) => state.preferredFood);
  // const constitution = useOnboardingStore((state) => state.constitution);
  // const allergies = useOnboardingStore((state) => state.allergies);

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
        <div className="flex flex-col items-center w-full">
          <section className="mt-10">
            <div className="my-10 text-xl font-medium">
              {"<"} {profile?.nickname || "로딩 중..."}의 기본 상태 {">"}
            </div>
          </section>
          <section className="flex flex-col items-start justify-start w-full gap-4 px-12 mt-10 mb-14">
            <InfoRow label="성별" content={profile?.gender || "None"} />
            <InfoRow
              label="운동 상태"
              content={profile?.workoutStatus || "None"}
            />
            <InfoRow
              label="선호 음식"
              content={
                profile?.preferredFood.length
                  ? profile?.preferredFood
                  : ["None"]
              }
            />
            <InfoRow
              label="체질"
              content={
                profile?.constitution.length ? profile?.constitution : ["None"]
              }
            />
            <InfoRow
              label="알레르기"
              content={
                profile?.allergies.length ? profile?.allergies : ["None"]
              }
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
