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
    if (newValue) {
      setShowModal(true);
      setSelectedDistance("가까이");
    } else {
      setSelectedDistance("");
    }
  };

  const handleCancel = () => {
    setShowModal(false); 
    setIsChecked(false); 
    setSelectedDistance("");
  }

  return (
    <div className="flex flex-col w-full h-screen relative overflow-x-hidden">
      <main className="flex flex-col items-center justify-center flex-1 w-full">
        {/* 질문 */}
        <div className="flex flex-col justify-center items-center text-center text-[#393939] font-['Noto Sans KR'] mb-10">
          <p className="text-xl font-semibold">위치를 입력해주세요</p>
          <p className="text-[#828282] mt-2">
            주변 맛집 메뉴로 추천해드릴게요
          </p>
        </div>

        {/* 체크박스 + 텍스트 + 거리 라벨 */}
        <div className="flex items-center gap-2 mt-4 ml-5">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="w-[1.25rem] h-[1.25rem] flex-shrink-0"
          />
          <label className="text-[1.25rem] text-[#393939] font-normal leading-normal font-['Inter'] ">
            내 주변
          </label>
          <div className="w-[5.875rem] h-[1.125rem] flex-shrink-0 rounded-[0.3125rem] border border-[#333] bg-white flex items-center justify-center text-sm text-black">
          {selectedDistance}
          </div>
        </div>
        <div className="mt-4 w-[17.5rem] h-[10.625rem] flex-shrink-0 rounded-[1.25rem] border-[3px] border-[#1F9BDA] overflow-hidden">
        <Image
          src="/map.png"
          alt="지도"
          width={280} 
          height={170}
          className="w-full h-full object-cover"
        />
        </div>

        {/* 결과 보기 버튼 */}
        <button
          onClick={() => router.push("/mainpage/result")}
          className="mt-10 flex w-[17.375rem] h-[2.8125rem] p-[0.625rem] flex-shrink-0 justify-center items-center gap-[0.625rem] rounded-[0.375rem] bg-[#FB4746] text-white text-[16px] font-medium"
        >
          결과 보기
        </button>
      </main>
      {showModal && (
        <div className="absolute inset-0 z-50 flex justify-center items-end">
          <div className="w-full">
          <LocationModal
            onClose={handleCancel}
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
    </div>
  );
}
