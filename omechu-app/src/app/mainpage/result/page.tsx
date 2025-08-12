// src/app/mainpage/result/page.tsx (ResultPage)
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Image from "next/image";
import ExcludeButton from "../components/ExcludeButton";
import MenuCard from "@/mainpage/components/MenuCard";
import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import TagCard from "../components/TagCard";
import { MenuItem } from "@/constant/mainpage/resultData";
import useGetRecommendMenu from "../hooks/useGetRecommendMenu";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import MainLoading from "@/components/mainpage/MainLoading";
import { useAuthStore } from "@/lib/stores/auth.store";
import LoginPromptModal2 from "../example_testpage/components/LoginPromptModal2";
import usePostMukburim from "../hooks/usePostMukburim";

export default function ResultPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } =
    useGetRecommendMenu();
  const { mutate } = usePostMukburim();
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [excludeMenu, setExcludeMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const menus: MenuItem[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data],
  );

  const [filteredMenus, setFilteredMenus] = useState(menus);

  const { setKeyword } = useLocationAnswerStore();

  const handleExcludeCLick = (menuName: string) => {
    if (isLoggedIn === false) {
      setShowLoginModal(true);
      return;
    }
    setExcludeMenu(menuName);
    setShowModal(true);
  };

  useEffect(() => {
    setFilteredMenus(menus);
  }, [menus]);

  const handleNext = () => {
    if (openMenu != null) {
      router.push(`/mainpage/result/${encodeURIComponent(openMenu)}`);
      setKeyword(openMenu);
      mutate(openMenu);
    } else {
      alert("메뉴를 선택해 주세요");
    }
  };

  // ← 여기서 refetch()를 호출
  const handleReshuffle = () => {
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
    }
    setShowModal(false);
    setExcludeMenu(null);
  };

  if (isLoading || isRefetching) {
    return <MainLoading />;
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        leftChild={
          <button
            onClick={() => router.push("/mainpage")}
            className="flex items-center font-bold"
          >
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="back"
              width={22}
              height={30}
            />
            <span className="mb-0.5 ml-1 flex flex-shrink-0">처음으로</span>
          </button>
        }
        className="h-[60px] border-b-0"
      />

      <div className="mt-3 flex flex-col px-4">
        {!isLoading &&
          !error &&
          filteredMenus.map((menu) => (
            <div key={menu.menu} className="relative mb-4">
              <ExcludeButton
                onClick={() => {
                  handleExcludeCLick(menu.menu);
                }}
              />
              <MenuCard
                title={menu.menu}
                description={menu.description}
                image={menu.image_link}
                onClick={() =>
                  setOpenMenu(openMenu === menu.menu ? null : menu.menu)
                }
                selected={openMenu === menu.menu}
              />
            </div>
          ))}
      </div>

      <div className="flex gap-2 px-4 py-2">
        <button
          className="flex-1 rounded-md border border-gray-500 bg-[#FFF] px-4 py-2 text-black hover:bg-grey-normal"
          onClick={handleReshuffle}
        >
          다시 추천
        </button>
        <button
          className="flex-1 rounded-md bg-primary-normal px-4 py-2 text-[#FFF] hover:bg-primary-normalHover"
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
          <AlertModal
            title={"추천 목록에서 메뉴를\n 제외하시겠어요?"}
            cancelText="취소"
            confirmText="제외하기"
            onConfirm={handleExclude}
            onClose={() => setShowModal(false)}
            swapButtonOrder
          />
        </ModalWrapper>
      )}
      {showLoginModal && (
        <ModalWrapper>
          <LoginPromptModal2
            onClose={() => {
              setShowLoginModal(false);
            }}
            onConfirm={() => {
              router.push("/sign-in");
            }}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
