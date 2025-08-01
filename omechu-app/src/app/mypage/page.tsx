"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useProfile } from "./hooks/useProfile";
import { useAuthStore } from "@/auth/store";

import BottomNav from "../components/common/Bottom";
import Header from "../components/common/Header";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";
import ModalWrapper from "@/components/common/ModalWrapper";
import AlertModal from "@/components/common/AlertModal";
import LoginPromptModal2 from "@/mainpage/example_testpage/components/LoginPromptModal2";

type ModalType = "modal1" | "modal2" | null;

export default function MyPage() {
  const router = useRouter();

  // 전역 상태에서 user 객체 가져오기
  const { profile, loading, error } = useProfile();
  const [minLoading, setMinLoading] = useState(true);

  const [imgError, setImgError] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setMinLoading(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setMinLoading(false);
    }
  }, [loading]);

  if (loading || minLoading) {
    return <LoadingSpinner label="프로필 정보 불러오는 중..." />;
  }

  const menuList: { title: string; href: string }[] = [
    { title: "프로필 관리", href: "/mypage/profile-edit" },
    { title: "기본 상태 입력", href: "/mypage/user-info-edit" },
    { title: "추천 목록 관리", href: "/mypage/recommended-list" },
    { title: "먹부림 기록", href: "/mypage/foodie-log" },
    { title: "활동 내역", href: "/mypage/my-activity" },
    { title: "찜 목록", href: "/mypage/favorites" },
  ];

  console.log("profile:", profile);
  console.log("loading:", loading);
  console.log("error:", error);

  const handleConfirm = () => {
    setActiveModal(null);
    alert("'로그인 하기' 클릭됨");
    router.push("/sign-in");
  };

  const handleClose = () => {
    setActiveModal(null);
    alert("모달 닫힘");
  };

  return (
    <>
      <Header
        className={"border-b-0"}
        rightChild={
          <button onClick={() => router.push("/mypage/settings")}>
            <Image
              src={"/setting/setting.svg"}
              alt={"설정"}
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
          <div className="text-lg font-md">
            {loading ? "로딩 중..." : profile?.nickname || "-"}
          </div>
          <div className="text-xs font-normal text-grey-normalActive">
            {loading ? "" : profile?.email || ""}
          </div>
        </section>
        <section className="w-full bg-white border-2 rounded-lg border-secondary-normal">
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
      {/* {error && (
        <ModalWrapper>
          <LoginPromptModal2 onConfirm={handleConfirm} onClose={handleClose} />
        </ModalWrapper>
      )} */}
      <BottomNav />
    </>
  );
}
