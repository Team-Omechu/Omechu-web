"use client";

import { MenuDetail } from "@/lib/types/menu";
import React, { useState } from "react";
import Toast from "@/components/common/Toast";
import router from "next/router";

interface MenuInfoProps {
  MenuItem?: MenuDetail;
}

export default function MenuInfo({ MenuItem }: MenuInfoProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleRecipeClick = () => {
    router.push(`/fullmenu/menu-detail${MenuItem?.name}/recipe`);
  };

  // 비타민 배열을 띄어쓰기로 구분하여 표시
  const formatVitamins = (vitamins: any) => {
    if (Array.isArray(vitamins)) {
      return vitamins.join(" ");
    }
    return vitamins;
  };

  const formatAllergics = (allergics: any) => {
    if (Array.isArray(allergics)) {
      return allergics.join(" ");
    }
    return allergics;
  };

  return (
    <div>
      <h2 className="mb-2 ml-1 text-base font-semibold">메뉴 정보</h2>
      <div className="w-full rounded-md border border-black bg-white p-4 text-sm">
        {/* 기본 영양 정보 */}
        <div className="text-sm text-gray-800">
          <p className="mb-2 font-medium text-grey-normal">기본 영양 정보</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>칼로리</span>
              <span className="text-[#828282]">{MenuItem?.calory}kcal</span>
            </div>
            <div className="flex justify-between">
              <span>탄수화물</span>
              <span className="text-[#828282]">{MenuItem?.carbo}g</span>
            </div>
            <div className="flex justify-between">
              <span>단백질</span>
              <span className="text-[#828282]">{MenuItem?.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>지방</span>
              <span className="text-[#828282]">{MenuItem?.fat}g</span>
            </div>
            <div className="flex justify-between">
              <span>비타민</span>
              <span className="text-[#828282]">
                {formatVitamins(MenuItem?.vitamin)}
              </span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* 알레르기 유발 성분 */}
          <p className="mb-2 font-medium text-[#A3A3A3]">알레르기 유발 성분</p>
          <p className="mb-4 text-sm">{formatAllergics(MenuItem?.allergic)}</p>

          <hr className="my-4 border-gray-200" />

          {/* 레시피 */}
          <p className="mb-1 font-medium text-grey-normal">레시피</p>
          <button
            onClick={handleRecipeClick}
            className="mb-3 text-sm text-grey-darker"
          >
            <span className="border-b border-grey-normalActive">보러가기</span>
            <span>▶</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
