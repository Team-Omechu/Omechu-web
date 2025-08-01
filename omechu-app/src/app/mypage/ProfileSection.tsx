// ProfileSection.tsx
"use client";

import type { ProfileType } from "./types/profileType";
import { useProfileQuery } from "./hooks/useProfileQuery";

export default function ProfileSection() {
  const { data: profile, isLoading, error } = useProfileQuery();

  if (isLoading) {
    return (
      <div className="h-[75px] w-[75px] animate-pulse rounded-full bg-gray-200" />
    );
  }

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
    </section>
  );
}
