// src/app/mainpage/result/page.tsx (ResultPage)
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Image from "next/image";
import ExcludeButton from "../components/ExcludeButton";
import MenuCard from "@/mainpage/components/MenuCard";
import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import TagCard from "../components/TagCard";
import {
  MenuItem
} from "@/constant/mainpage/resultData";
import useGetRecommendMenu from "../hooks/useGetRecommendMenu";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import MainLoading from "@/components/mainpage/MainLoading";
import { useTagStore } from "@/lib/stores/tagData.store";
import { useQuestionAnswerStore } from "@/lib/stores/questionAnswer.store";
import { useAuthStore } from "@/auth/store";
import LoginPromptModal from "../example_testpage/components/LoginPromptModal";

export default function ResultPage() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGetRecommendMenu();
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [excludeMenu, setExcludeMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const {tagDataReset} = useTagStore();
  const {locationReset} = useLocationAnswerStore();
  const {questionReset} = useQuestionAnswerStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const menus: MenuItem[] = Array.isArray(data) ? data : [];

  const [filteredMenus, setFilteredMenus] = useState(menus);

  const { setKeyword } = useLocationAnswerStore();
  const {tagData} = useTagStore();

  const login = false;

  const handleExcludeCLick = (menuName: string) => {
    if (!login){
      setShowLoginModal(true);
      return;
    }
    setExcludeMenu(menuName)
    setShowModal(true);
  }

  useEffect(() => {
    setFilteredMenus(menus);
  }, [data]);

  const handleNext = () => {
    if (openMenu != null) {
      router.push(`/mainpage/result/${encodeURIComponent(openMenu)}`);
      setKeyword(openMenu);
    } else {
      alert("메뉴를 선택해 주세요");
    }
  };

  // ← 여기서 refetch()를 호출
  const handleReshuffle = () => {
    refetch();
    setOpenMenu(null);
    if(isLoading){
      return <MainLoading/>
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

  const handleClick = () => {
    router.push("/mainpage");
    tagDataReset();
    locationReset();
    questionReset();
  }

  const handleNextClick = () => {
    if(!login){  
      setShowLoginModal(true);
      return;
    }
    handleNext();
  }

  if(isLoading){
    return <MainLoading/>
  }

  return (
    <div className="flex h-screen flex-col">
      <Header
        leftChild={
          <button
            onClick={handleClick}
            className="flex items-center font-bold"
          >
            <Image
              src="/header_left_arrow.png"
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
                onClick={() => {handleExcludeCLick(menu.menu)}}
              />
              <MenuCard
                title={menu.menu}
                description={menu.description}
                image={"/image/image_empty.svg"}
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
          onClick={handleNextClick}
        >
          선택하기
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="rounded-md border bg-white p-3 text-sm">
          {tagData.map(({ tag, description }) => (
            <TagCard key={tag} tag={tag} description={description} />
          ))}
        </div>
      </div>

      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="추천 목록에서 메뉴를 제외하시겠어요?"
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
        <LoginPromptModal
        onClose={()=>{setShowLoginModal(false)}}
        onConfirm={()=>{router.push("/sign-in")}}/>
        </ModalWrapper>
      )}
    </div>
  );
}
