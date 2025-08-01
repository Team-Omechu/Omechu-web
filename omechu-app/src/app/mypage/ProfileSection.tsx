// ProfileSection.tsx
"use client";

import { useProfileQuery } from "./hooks/useProfileQuery";
import AuthErrorModal from "./AuthErrorModalSection";
import { useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";
import ModalWrapper from "@/components/common/ModalWrapper";

export default function ProfileSection() {
  const { data: profile, isLoading, error } = useProfileQuery();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAuthError = () => setModalOpen(true);

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {typeof error === "string"
          ? error
          : error && typeof error === "object" && "message" in error
            ? (error as any).message
            : "알 수 없는 오류"}
      </div>
    );
  }

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
      <div className="text-lg font-md">{profile?.nickname || "-"}</div>
      <div className="text-xs font-normal text-grey-normalActive">
        {profile?.email || ""}
      </div>
      {modalOpen && (
        <AuthErrorModal
          onConfirm={() => setModalOpen(false)}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
