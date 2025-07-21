"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import ModalWrapper from "@/components/common/ModalWrapper";
import { menus as defaultMenus, tagData } from "@/constant/mainpage/resultData";
import MenuCard from "@/mainpage/components/MenuCard";

import ExcludeButton from "../components/ExcludeButton";
import TagCard from "../components/TagCard";

function getRandomMenus() {
  const shuffled = [...defaultMenus].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function ResultPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuIdForExclude, setSelectedMenuIdForExclude] = useState<
    number | null
  >(null); // 제외 대상
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menus, setMenus] = useState<typeof defaultMenus | null>(null);

  useEffect(() => {
    setMenus(getRandomMenus);
  }, []);

  const handleNext = () => {
    if (openMenuId !== null) {
      router.push(`/mainpage/result/${openMenuId}`);
    } else {
      alert("메뉴를 선택해 주세요");
    }
  };

  const handleReshuffle = () => {
    setMenus(getRandomMenus());
    setOpenMenuId(null);
  };

  const handleExclude = () => {
    if (selectedMenuIdForExclude !== null && menus) {
      setMenus(menus.filter((m) => m.id !== selectedMenuIdForExclude));
      if (openMenuId === selectedMenuIdForExclude) {
        setOpenMenuId(null); // 선택된 메뉴가 제외된 경우 초기화
      }
    }
    setShowModal(false);
    setSelectedMenuIdForExclude(null);
  };

  return (
    <div className="flex flex-col p-4">
      <button className="flex justify-start" onClick={() => router.push("./")}>
        &lt; 처음으로
      </button>

      <div className="mt-3 flex flex-col gap-4">
        {menus?.map((menu) => (
          <div key={menu.id} className="relative">
            <ExcludeButton
              onClick={() => {
                setSelectedMenuIdForExclude(menu.id);
                setShowModal(true);
              }}
            />
            <MenuCard
              title={menu.title}
              description={menu.description}
              image={menu.image}
              onClick={() => setOpenMenuId(menu.id)}
              selected={openMenuId === menu.id}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between gap-2">
        <button
          className="flex-1 rounded-md bg-[#FB4746] px-4 py-2 text-[#FFF]"
          onClick={handleReshuffle}
        >
          다시 추천
        </button>
        <button
          className="flex-1 rounded-md border border-gray-500 bg-[#FFF] px-4 py-2 text-black"
          onClick={handleNext}
        >
          선택하기
        </button>
      </div>

      <div className="mt-5 rounded-md border border-black bg-white p-3 text-sm">
        {tagData?.map(({ tag, description }) => (
          <TagCard key={tag} tag={tag} description={description} />
        ))}
      </div>

      {showModal && (
        <ModalWrapper>
          <AlertModal
            title="추천 목록에서 메뉴를 제외하시겠어요?"
            cancelText="취소"
            confirmText="제외하기"
            onConfirm={handleExclude}
            onClose={() => {
              setShowModal(false);
              setSelectedMenuIdForExclude(null);
            }}
            swapButtonOrder={true}
          />
        </ModalWrapper>
      )}
    </div>
  );
}
