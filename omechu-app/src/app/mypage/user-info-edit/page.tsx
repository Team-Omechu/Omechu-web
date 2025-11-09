/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

import Header from "@/components/common/Header";
import InfoRow from "./InfoRow";
import { indexToSlug } from "@/constant/UserInfoEditSteps";

import { fetchProfile as fetchProfileApi } from "@/mypage/api/profile";

// 서버 응답을 페이지에서 쓰는 ProfileType으로 정규화
function normalizeProfile(raw: any): ProfileType {
  const nickname = raw?.nickname ?? raw?.name ?? "";
  const gender = raw?.gender ?? raw?.sex ?? null;
  const exercise = raw?.exercise ?? null;
  const prefer = Array.isArray(raw?.prefer)
    ? raw.prefer
    : raw?.prefer
      ? [raw.prefer]
      : [];
  const bodyTypeVal = raw?.bodyType ?? raw?.body_type ?? null;
  const bodyType = Array.isArray(bodyTypeVal)
    ? bodyTypeVal
    : bodyTypeVal
      ? [bodyTypeVal]
      : [];
  const allergy = Array.isArray(raw?.allergy)
    ? raw.allergy
    : raw?.allergy
      ? [raw.allergy]
      : [];
  const profileImageUrl =
    raw?.profileImageUrl ?? raw?.profile_image_url ?? null;

  return {
    nickname,
    gender,
    exercise,
    prefer,
    bodyType,
    allergy,
    profileImageUrl,
  };
}

type ProfileType = {
  nickname: string;
  gender?: string | null;
  exercise?: string | null; // exercise 필드 매핑
  prefer: string[]; // prefer 필드 매핑
  bodyType: string[]; // body_type 필드 매핑, 배열로 변환
  allergy: string[]; // allergy 필드 매핑
  profileImageUrl?: string | null; // 이미지 URL
};

export default function UserInfoEdit() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchProfileApi();
        const profileData: ProfileType = normalizeProfile(data);
        console.log("[DEBUG] 프로필 데이터(raw):", data);
        console.log("[DEBUG] 프로필 데이터(normalized):", profileData);
        setProfile(profileData);
      } catch (err) {
        const error = err as any;
        if (error?.response?.status === 401) {
          router.push(
            `/auth/sign-in?redirect=${encodeURIComponent("/mypage/user-info-edit")}`,
          );
          return;
        }
        setError("프로필을 불러오지 못했습니다.");
      }
    }
    loadProfile();
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
            className="h-8 w-8 animate-spin text-primary-normal"
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
            <img
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
              {"<"} {profile.nickname || "로딩 중..."}의 기본 상태 {">"}
            </div>
          </section>
          <section className="mb-14 mt-10 flex w-full flex-col items-start justify-start gap-4 px-12">
            <InfoRow label="성별" content={profile.gender || "None"} />
            <InfoRow label="운동 상태" content={profile.exercise || "None"} />
            <InfoRow
              label="선호 음식"
              content={profile.prefer.length > 0 ? profile.prefer : ["None"]}
            />
            <InfoRow
              label="체질"
              content={
                profile.bodyType.length > 0 ? profile.bodyType : ["None"]
              }
            />
            <InfoRow
              label="알레르기"
              content={profile.allergy.length > 0 ? profile.allergy : ["None"]}
            />
          </section>
        </div>

        <section>
          <button
            onClick={() =>
              router.push(`/mypage/user-info-edit/${indexToSlug[0]}`)
            }
            className="h-12 w-[340px] rounded-md bg-primary-normal text-[17px] font-medium text-white hover:bg-primary-normal-hover active:bg-primary-normal-active"
          >
            다시 입력하기
          </button>
        </section>
      </main>
    </>
  );
}
