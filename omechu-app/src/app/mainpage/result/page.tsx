"use client";

import AlertModal from "@/app/components/common/AlertModal";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import MenuCard from "@/app/mainpage/components/MenuCard";
import {
  menus as defaultMenus,
  tagDescriptions,
  tags,
} from "@/app/constant/mainpage/resultData";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExcludeButton from "../components/ExcludeButton";

function getRandomMenus() {
  const shuffled = [...defaultMenus].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export default function ResultPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuIdForExclude, setSelectedMenuIdForExclude] = useState<number | null>(null); // 제외 대상
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
    <div className="p-4 flex flex-col">
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
          className="bg-[#FB4746] text-[#FFF] rounded-md px-4 py-2 flex-1"
          onClick={handleReshuffle}
        >
          다시 추천
        </button>
        <button
          className="border border-gray-500 text-black bg-[#FFF] rounded-md px-4 py-2 flex-1"
          onClick={handleNext}
        >
          선택하기
        </button>
      </div>

      <div className="mt-5 bg-white p-3 rounded-md text-sm border border-black">
        {tags.map((tag, idx) => (
          <div key={idx} className="mb-1 text-black flex flex-col p-1">
            <span className="font-semibold text-[#A3A3A3] mb-1">{tag}</span>
            {tagDescriptions[idx]}
          </div>
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
          />
        </ModalWrapper>
      )}
    </div>
  );
}
