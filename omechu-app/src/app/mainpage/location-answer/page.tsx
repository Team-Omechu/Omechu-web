"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import BottomNav from "@/app/components/mainpage/BottomNav";
import LocationModal from "@/app/components/mainpage/LocationModal";

export default function LocationAnswerPage() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState("");

  const handleCheckboxChange = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (newValue) setShowModal(true);
    setSelectedDistance("");
  };

  return (
    <div className="flex flex-col w-full h-screen relative">
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        {/* 질문 */}
        <div className="flex flex-col justify-center items-center w-[415px] h-[112px] text-center text-[#393939] font-['Noto Sans KR'] font-medium text-[24px] mb-10">
          <p>위치를 입력해주세요</p>
          <p className="text-[#828282] text-[18px] font-normal mt-2">
            주변 맛집 메뉴로 추천해드릴게요
          </p>
        </div>

        {/* 체크박스 + 텍스트 + 거리 라벨 */}
        <div className="flex items-center gap-2 mt-4 ml-5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-[20px] h-[20px] p-1"
          />
          <label className="text-[#333] text-[20px] font-normal font-['Inter']">
            내 주변
          </label>
          <div
            className="w-[94px] h-[28px] border border-[#333] rounded-[5px] bg-white px-2 text-sm flex items-center justify-center text-black"
          >
            {selectedDistance}
          </div>
        </div>

        {/* 지도 이미지 */}
        <div className="mt-4 w-[280px] h-[170px] rounded-[20px] border-[3px] border-[#1F9BDA] overflow-hidden">
          <Image
            src={"/map.png"}
            alt="지도"
            width={280}
            height={170}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 결과 보기 버튼 */}
        <button
          onClick={() => router.push("/result")}
          className="mt-6 flex w-[278px] h-[45px] px-4 justify-center items-center gap-2 rounded-[6px] bg-[#FB4746] text-white text-[16px] font-medium"
        >
          결과 보기
        </button>
      </main>
      {showModal && (
        <div className="absolute inset-0 z-50 flex justify-center items-end">
          <div className="w-full">
          <LocationModal
            onClose={() => {setShowModal(false); setIsChecked(false);}}
            onSelect={(distance) => {
              setSelectedDistance(distance);
              setShowModal(false);
            }}
          />
          </div>
        </div>
      )}

      {/* 하단 네비 */}
      <BottomNav prevPath="./meal-answer" showNext={false} />

      {/* 거리 선택 모달 - overlay로 렌더 */}

    </div>
  );
}
