// src/app/mainpage/result/page.tsx (ResultPage)
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Header,
  MainLoading,
  ModalWrapper,
  BaseModal,
  Toast,
  RecommendedFoodCard,
} from "@/shared";
import { useAuthStore } from "@/entities/user/model/auth.store";
import { exceptMenu } from "@/entities/mypage";
import { MenuItem, useGetMenu } from "@/entities/menu";
import { useQuestionAnswerStore } from "@/entities/question";
import { useLocationAnswerStore } from "@/entities/location";
import { TagCard } from "@/widgets/TagCard";
// TODO: ExcludeButton이 shared/widgets에 없음 - 추가 필요

const menuMock = [
  {
    id: 1,
    menu: "샤브샤브",
    description: "신성한 채소와 고기를 육수에 살짝 담가 먹는 따끈한 건강식",
    image_link: "../public/logo/logo.svg",
  },
  {
    id: 2,
    menu: "스테이크",
    description: "두툼한 고기의 풍미를 그대로 살린 육즙 가득한 정통 스테이크",
    image_link: "../public/logo/logo.svg",
  },
  {
    id: 3,
    menu: "사케동",
    description: "부드러운 연어회가 듬뿍 올라간 일본식 연어 덮밥",
    image_link: "../public/logo/logo.svg",
  },
];
export default function ResultPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = useGetMenu();
  const [excludeAttemptCount, setExcludeAttemptCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [excludeMenu, setExcludeMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { addException } = useQuestionAnswerStore();

  const menus: MenuItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const [filteredMenus, setFilteredMenus] = useState(menus);

  const { setKeyword } = useLocationAnswerStore();

  const handleExcludeCLick = (menuName: string) => {
    if (!isLoggedIn) {
      setExcludeAttemptCount((prev) => {
        const next = prev + 1;

        // ✅ 3번 이상 누르면 로그인 유도 모달
        if (next >= 3) {
          setShowLoginModal(true);
          return next;
        }

        // ✅ 1~2번은 기존처럼 "제외 확인 모달"
        setExcludeMenu(menuName);
        setShowModal(true);
        return next;
      });

      return;
    }

    // 로그인 상태면 기존 로직 그대로
    setExcludeMenu(menuName);
    setShowModal(true);
  };

  useEffect(() => {
    setFilteredMenus(menus);
  }, [menus]);

  const handleNext = () => {
    if (openMenu != null) {
      setKeyword(openMenu);
      router.push(`/mainpage/result/${encodeURIComponent(openMenu)}?record=1`);
    } else {
      triggerToast("메뉴를 선택해주세요.");
    }
  }; // record=1을 넘겨줄 필요가 없는거 같은데..?

  // ← 여기서 refetch()를 호출
  const handleReshuffle = () => {
    //기존 메뉴를 제외하기위해 exceptions에 추가.
    const exceptionMenus = menus.slice(0, 3).map((m) => m.menu);
    const unique = Array.from(new Set(exceptionMenus));
    unique.forEach(addException);
    refetch();
    setOpenMenu(null);
    if (isLoading) {
      return <MainLoading />;
    }
  };

  const handleExclude = () => {
    if (excludeMenu != null) {
      setFilteredMenus((prev) =>
        prev.filter((menu) => menu.menu !== excludeMenu),
      );
      if (openMenu === excludeMenu) setOpenMenu(null);
      exceptMenu({ menuName: excludeMenu }).catch(() => {
        triggerToast("메뉴 제외에 실패했습니다.");
      });
    }
    setShowModal(false);
    setExcludeMenu(null);
  };

  // if (isLoading || isRefetching) {
  //   return <MainLoading />;
  // } -> 컴포넌트 교체로 잠시 제거

  return (
    <div className="flex h-screen flex-col">
      <Header
        onLeftClick={() => router.push("./")}
        title="맞춤 추천"
        isRightChild={true}
      />

      {/*!isLoading &&
          !error && */}
      <div className="mt-3 ml-2.5 flex flex-col gap-4 px-4">
        {menuMock.map((menu) => (
          <RecommendedFoodCard
            key={menu.id}
            menuTitle={menu.menu}
            onMinusButtonClick={() => {
              handleExcludeCLick(menu.menu);
            }}
            menuDesc={menu.description}
            src={menu.image_link}
            onCardClick={() =>
              setOpenMenu(openMenu === menu.menu ? null : menu.menu)
            }
            selected={openMenu === menu.menu}
          />
        ))}
      </div>

      <div className="flex gap-2 px-4 py-2">
        <button
          className="border-grey-dark-hover hover:bg-grey-normal flex-1 rounded-md border bg-[#FFF] px-4 py-2 text-[#393939]"
          onClick={handleReshuffle}
        >
          다시 추천
        </button>
        <button
          className="bg-primary-normal hover:bg-primary-normal-hover flex-1 rounded-md px-4 py-2 text-[#FFF]"
          onClick={handleNext}
        >
          선택하기
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="rounded-md border bg-white p-3 text-sm">
          <TagCard />
        </div>
      </div>

      {showModal && (
        <ModalWrapper>
          <BaseModal
            title={"추천 목록에서 메뉴를\n 제외하시겠어요?"}
            leftButtonText="취소"
            rightButtonText="제외하기"
            isCloseButtonShow={false}
            onRightButtonClick={handleExclude}
            onLeftButtonClick={() => setShowModal(false)}
          />
        </ModalWrapper>
      )}
      {showLoginModal && (
        <ModalWrapper>
          <BaseModal
            title="더 많은 기능을 원하시나요?"
            desc="로그인 후 더 다양한 서비스를 누려보세요"
            leftButtonText="로그인하기"
            isLogoShow={true}
            onCloseClick={() => {
              setShowLoginModal(false);
            }}
            onLeftButtonClick={() => {
              router.push("/sign-in");
            }}
          />
        </ModalWrapper>
      )}
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
