// ProfileSection.tsx
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
          className="mb-9.5 mt-6"
        />
      </main>
    );
  }

  return (
    <section className="flex flex-col items-center">
      {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
      <img
        src={profile?.profileImageUrl || "/profile/profile_default_img.svg"}
        width={75}
        height={75}
      />
      <div className="font-md text-lg">{profile?.nickname || "-"}</div>
      <div className="text-xs font-normal text-grey-normalActive">
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
