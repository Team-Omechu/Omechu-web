"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import { useAuthStore } from "@/lib/stores/auth.store";

import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";

export default function MyPage() {
  const router = useRouter();

  // 전역 상태에서 user 객체 가져오기
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ? Number(user.id) : undefined; // id가 string이면 변환, number면 그대로
  const { profile, loading, error } = useProfile(userId);

  const [imgError, setImgError] = useState(false);

  const menuList: { title: string; href: string }[] = [
    { title: "프로필 관리", href: "/mypage/profile-edit" },
    { title: "기본 상태 입력", href: "/mypage/user-info-edit" },
    { title: "추천 목록 관리", href: "/mypage/recommended-list" },
    { title: "먹부림 기록", href: "/mypage/foodie-log" },
    { title: "활동 내역", href: "/mypage/my-activity" },
    { title: "찜 목록", href: "/mypage/favorites" },
  ];

  console.log("userId:", userId);
  console.log("profile:", profile);
  console.log("loading:", loading);
  console.log("error:", error);

  // console.log(useAuthStore.getState().user);
  return (
    <>
      <Header
        className={"border-b-0"}
        rightChild={
          <button onClick={() => router.push("/mypage/settings")}>
            <Image
              src={"/setting.png"}
              alt={"setting"}
              width={25}
              height={25}
            />
          </button>
        }
      />
      <main className="flex h-[calc(100dvh-8rem)] w-full flex-col items-center justify-start gap-16 px-10 py-16">
        <section className="flex flex-col items-center">
          <div className="my-4">
            {/* 로딩/에러/정상 분기 */}
            {loading ? (
              <div className="h-[75px] w-[75px] animate-pulse rounded-full bg-gray-200" />
            ) : error ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : (
              <Image
                src={
                  !imgError && !!profile?.profileImageUrl
                    ? profile.profileImageUrl
                    : "/profile/profile_default_img.svg"
                }
                alt="profile"
                width={75}
                height={75}
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="font-md text-lg">
            {loading ? "로딩 중..." : profile?.nickname || "-"}
          </div>
          <div className="text-xs font-normal text-grey-normalActive">
            {loading ? "" : profile?.email || ""}
          </div>
        </section>
        <section className="w-full rounded-lg border-2 border-secondary-normal bg-white">
          {menuList.map((item, index) => {
            const isLast = index === menuList.length - 1;
            return (
              <div key={index}>
                <button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  className="flex w-full items-center justify-between rounded-lg bg-white px-4 pb-2.5 pt-3 text-secondary-normal hover:bg-grey-lightHover hover:text-secondary-normalHover active:bg-grey-lightActive active:text-secondary-normalActive"
                >
                  <span className="pl-3 text-lg">{item.title}</span>
                  <span className="pr-3">
                    <Image
                      src={"/arrow/right_arrow.svg"}
                      alt={"메뉴 이동 버튼"}
                      width={13}
                      height={13}
                    />
                  </span>
                </button>
                {!isLast && (
                  <div className="mx-auto h-[1.2px] w-[calc(100%-2.5rem)] bg-secondary-lightActive" />
                )}
              </div>
            );
          })}
        </section>
      </main>
      <BottomNav />
    </>
  );
}
