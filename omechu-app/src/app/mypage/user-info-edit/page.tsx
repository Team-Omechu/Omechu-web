"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import Header from "@/components/common/Header";
import InfoRow from "./InfoRow";
import { indexToSlug } from "@/constant/UserInfoEditSteps";

import { getProfile } from "../api/profile";

type ProfileType = {
  nickname: string;
  gender?: string | null;
  workoutStatus?: string | null; // exercise 필드 매핑
  preferredFood: string[]; // prefer 필드 매핑
  constitution: string[]; // body_type 필드 매핑, 배열로 변환
  allergies: string[]; // allergy 필드 매핑
  profileImageUrl?: string | null; // 이미지 URL
};

export default function UserInfoEdit() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getProfile();

        const profileData: ProfileType = {
          nickname: data.nickname,
          gender: data.gender,
          workoutStatus: data.exercise || null,
          preferredFood: Array.isArray(data.prefer) ? data.prefer : [],
          constitution: data.body_type ? [data.body_type] : [],
          allergies: Array.isArray(data.allergy) ? data.allergy : [],
          profileImageUrl: data.profileImageUrl || null,
        };
        console.log("[DEBUG] 프로필 데이터:", data);
        setProfile(profileData);
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
  }, []);

  if (error)
    return (
      <main className="flex min-h-[calc(100dvh-3rem)] w-full items-center justify-center">
        <span className="text-base text-red-600">{error}</span>
      </main>
    );
  if (!profile)
    return (
      <main className="flex min-h-[calc(100dvh-3rem)] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="w-8 h-8 animate-spin text-primary-normal"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="12"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-lg font-medium text-gray-500">로딩 중...</span>
        </div>
      </main>
    );

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
              {"<"} {profile.nickname || "로딩 중..."}의 기본 상태 {">"}
            </div>
          </section>
          <section className="flex flex-col items-start justify-start w-full gap-4 px-12 mt-10 mb-14">
            <InfoRow label="성별" content={profile.gender || "None"} />
            <InfoRow
              label="운동 상태"
              content={profile.workoutStatus || "None"}
            />
            <InfoRow
              label="선호 음식"
              content={
                profile.preferredFood.length > 0
                  ? profile.preferredFood
                  : ["None"]
              }
            />
            <InfoRow
              label="체질"
              content={
                profile.constitution.length > 0
                  ? profile.constitution
                  : ["None"]
              }
            />
            <InfoRow
              label="알레르기"
              content={
                profile.allergies.length > 0 ? profile.allergies : ["None"]
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
