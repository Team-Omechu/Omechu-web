"use client";

import { MenuItem } from "@/constant/mainpage/resultData";
import React from "react";

interface MenuDetail {
  MenuItem: MenuItem;
  onRecipeClick?: () => void;
}

export default function MenuInfo({ MenuItem, onRecipeClick }: MenuDetail) {
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
              <span className="text-[#828282]">{MenuItem.calories}kcal</span>
            </div>
            <div className="flex justify-between">
              <span>탄수화물</span>
              <span className="text-[#828282]">{MenuItem.carbohydrates}g</span>
            </div>
            <div className="flex justify-between">
              <span>단백질</span>
              <span className="text-[#828282]">{MenuItem.protein}g</span>
            </div>
            <div className="flex justify-between">
              <span>지방</span>
              <span className="text-[#828282]">{MenuItem.fat}g</span>
            </div>
            <div className="flex justify-between">
              <span>비타민</span>
              <span className="text-[#828282]">
                {MenuItem.vitamins.join(",")}
              </span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* 알레르기 유발 성분 */}
          <p className="mb-2 font-medium text-[#A3A3A3]">알레르기 유발 성분</p>
          <p className="mb-4 text-sm">{MenuItem.allergies.join(",")}</p>

          <hr className="my-4 border-gray-200" />

          {/* 레시피 */}
          <p className="mb-1 font-medium text-grey-normal">레시피</p>
          <button
            className="mb-3 text-sm text-grey-darker"
            onClick={onRecipeClick}
          >
            <span className="border-b border-grey-normalActive">보러가기</span>
            <span>▶</span>
          </button>
        </div>
      </div>
    </div>
  );
}
