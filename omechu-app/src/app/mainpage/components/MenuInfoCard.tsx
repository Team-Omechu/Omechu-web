"use client";

import React from "react";

interface MenuDetail {
  nutrition: {
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
    vitamin:string;
  };
  allergens: string[];
}

export default function MenuInfo({nutrition,allergens}:MenuDetail) {
  return (
    <div>
      <h3 className="text-l font-semibold mb-2 ml-1">메뉴 정보</h3>
    <div className="bg-white border border-gray-300 rounded-md p-2 w-full">

      {/* 기본 영양 정보 */}
      <div className="text-sm text-gray-800">
        <p className="font-medium mb-2 text-[#A3A3A3] ">기본 영양 정보</p>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>칼로리</span><span className="text-[#828282]">{nutrition.calories}</span>
          </div>
          <div className="flex justify-between">
            <span>탄수화물</span><span className="text-[#828282]">{nutrition.carbs}</span>
          </div>
          <div className="flex justify-between">
            <span>단백질</span><span className="text-[#828282]">{nutrition.protein}</span>
          </div>
          <div className="flex justify-between">
            <span>지방</span><span className="text-[#828282]">{nutrition.fat}</span>
          </div>
          <div className="flex justify-between">
            <span>비타민</span><span className="text-[#828282]">{nutrition.vitamin}</span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* 알레르기 유발 성분 */}
        <p className="font-medium mb-2 text-[#A3A3A3]">알레르기 유발 성분</p>
        <p className="text-sm mb-4">{allergens}</p>

        <hr className="my-4 border-gray-200" />

        {/* 레시피 */}
        <p className="font-medium mb-1 text-[#A3A3A3]">레시피</p>
        <button className="text-sm text-[#393939] mb-3 border-b border-b-[#828282]">
          보러가기 &gt;
        </button>
      </div>
    </div>
    </div>
  );
}
