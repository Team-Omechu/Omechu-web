"use client";

import { useProfileQuery } from "./hooks/useProfileQuery";
import AuthErrorModal from "./AuthErrorModalSection";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";
import { useRouter } from "next/navigation";

export default function ProfileSection() {
  const { data: profile, isLoading, error } = useProfileQuery();

  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // 프로필 데이터가 없고, 로딩도 아니면
    if (!isLoading && !profile) {
      setModalOpen(true);
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <main className="h-fit">
        <LoadingSpinner
          label="프로필 정보 불러오는 중..."
          className="mb-12 mt-7 overflow-y-scroll scrollbar-hide"
        />
      </main>
    );
  }

  return (
    <section className="flex flex-col items-center gap-1 overflow-y-scroll scrollbar-hide">
      <div className="relative h-[130px] w-[130px] overflow-hidden rounded-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile?.profileImageUrl || "/profile/profile_default_img.svg"}
          alt="프로필 이미지"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 text-2xl font-semibold">
        {profile?.nickname || "-"}
      </div>
      <div className="text-lg font-normal text-grey-normalActive">
        {profile?.email || ""}
      </div>
      {modalOpen && (
        <AuthErrorModal
          onConfirm={() => {
            setModalOpen(false);
            router.push("/sign-in");
          }}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
