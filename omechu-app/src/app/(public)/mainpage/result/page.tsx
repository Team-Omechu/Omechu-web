"use client";

import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useLocationAnswerStore } from "@/entities/location";
import { MenuItem, useGetMenu, useReshufflePolicy } from "@/entities/menu";
import { useQuestionAnswerStore } from "@/entities/question";
import { useAuthStore } from "@/entities/user/model/auth.store";
import {
  Header,
  MainLoading,
  ModalWrapper,
  BaseModal,
  Toast,
  Button,
} from "@/shared";
import { ResultMenuList } from "@/widgets/result-menu-list";
import { TagCard } from "@/widgets/TagCard";

export default function ResultPage() {
  const router = useRouter();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { data, isLoading, refetch, isRefetching } = useGetMenu();

  const { addException } = useQuestionAnswerStore();
  const { setKeyword } = useLocationAnswerStore();

  const menus: MenuItem[] = useMemo(
    () => (Array.isArray(data?.results) ? data.results : []),
    [data],
  );

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [showStopRecommendModal, setShowStopRecommendModal] = useState(false);

  // 제외 하기 정책 관련 훅
  const {
    handleReshuffle,
    showLoginModalForReshuffle,
    closeLoginModalForReshuffle,
  } = useReshufflePolicy({
    isLoggedIn,
    menus,
    addException,
    refetch,
    setOpenMenu,
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2500);
  };

  const handleStopAndGoHome = () => {
    setShowStopRecommendModal(false);
    router.push("/mainpage");
  };

  const handleContinueRecommend = () => {
    setShowStopRecommendModal(false);
  };

  const handleNext = () => {
    if (openMenu != null) {
      setKeyword(openMenu);
      router.push(`/mainpage/result/${encodeURIComponent(openMenu)}?record=1`);
    } else {
      triggerToast("메뉴를 선택해주세요.");
    }
  };

  const handleLoginButton = () => {
    router.push("/login");
    closeLoginModalForReshuffle();
  };

  const handleToggleMenu = (menuName: string) => {
    setOpenMenu((prev) => (prev === menuName ? null : menuName));
  };

  if (isLoading || isRefetching) return <MainLoading />;

  return (
    <div className="flex h-screen flex-col items-center">
      <Header
        title="맞춤 추천"
        onBackClick={() => router.back()}
        showHomeButton={true}
      />

      <ResultMenuList
        menus={menus}
        openMenu={openMenu}
        onToggleMenu={handleToggleMenu}
      />

      <div className="mt-2 flex w-82.5 gap-2 py-2">
        <Button
          className="hover:bg-grey-normal text-foundation-grey-darker border-font-disabled flex-1 rounded-md border bg-[#EEE] px-4 py-2"
          onClick={handleReshuffle}
        >
          다시 추천
        </Button>

        <Button
          className="bg-primary-normal hover:bg-primary-normal-hover flex-1 rounded-md px-4 py-2 text-[#FFF]"
          onClick={handleNext}
        >
          선택하기
        </Button>
      </div>

      <div className="px-4 py-2">
        <div className="rounded-xl border bg-white p-3 text-sm">
          <TagCard />
        </div>
      </div>

      {/* 모달 관련 컴포넌트 */}
      {showLoginModalForReshuffle && (
        <ModalWrapper>
          <BaseModal
            title="딱 맞는 추천을 원하시나요?"
            desc="로그인 후 더 다양한 서비스를 누려보세요"
            rightButtonText="로그인하기"
            isLogoShow
            isCloseButtonShow={false}
            onRightButtonClick={handleLoginButton}
          />
        </ModalWrapper>
      )}

      {showStopRecommendModal && (
        <ModalWrapper>
          <BaseModal
            title="메뉴 추천을 중단하시겠어요?"
            leftButtonText="홈으로"
            rightButtonText="계속하기"
            isCloseButtonShow={false}
            onLeftButtonClick={handleStopAndGoHome}
            onRightButtonClick={handleContinueRecommend}
          />
        </ModalWrapper>
      )}

      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
