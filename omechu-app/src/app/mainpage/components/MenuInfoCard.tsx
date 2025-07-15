"use client";

import React from "react";

interface MenuDetail {
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
    vitamin: string;
  };
  allergens: string[];
}

export default function MenuInfo({ nutrition, allergens }: MenuDetail) {
  return (
    <div>
      <h3 className="text-l mb-2 ml-1 font-semibold">메뉴 정보</h3>
      <div className="w-full rounded-md border border-gray-300 bg-white p-2">
        {/* 기본 영양 정보 */}
        <div className="text-sm text-gray-800">
          <p className="mb-2 font-medium text-[#A3A3A3]">기본 영양 정보</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>칼로리</span>
              <span className="text-[#828282]">{nutrition.calories}</span>
            </div>
            <div className="flex justify-between">
              <span>탄수화물</span>
              <span className="text-[#828282]">{nutrition.carbs}</span>
            </div>
            <div className="flex justify-between">
              <span>단백질</span>
              <span className="text-[#828282]">{nutrition.protein}</span>
            </div>
            <div className="flex justify-between">
              <span>지방</span>
              <span className="text-[#828282]">{nutrition.fat}</span>
            </div>
            <div className="flex justify-between">
              <span>비타민</span>
              <span className="text-[#828282]">{nutrition.vitamin}</span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* 알레르기 유발 성분 */}
          <p className="mb-2 font-medium text-[#A3A3A3]">알레르기 유발 성분</p>
          <p className="mb-4 text-sm">{allergens}</p>

          <hr className="my-4 border-gray-200" />

          {/* 레시피 */}
          <p className="mb-1 font-medium text-[#A3A3A3]">레시피</p>
          <button className="mb-3 border-b border-b-[#828282] text-sm text-[#393939]">
            보러가기 &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
