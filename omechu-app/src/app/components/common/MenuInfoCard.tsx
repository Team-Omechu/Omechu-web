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
  onRecipeClick?: () => void;
}

export default function MenuInfo({
  nutrition,
  allergens,
  onRecipeClick,
}: MenuDetail) {
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
              <span className="text-grey-normalActive">
                {nutrition.calories}
              </span>
            </div>
            <div className="flex justify-between">
              <span>탄수화물</span>
              <span className="text-grey-normalActive">{nutrition.carbs}</span>
            </div>
            <div className="flex justify-between">
              <span>단백질</span>
              <span className="text-grey-normalActive">
                {nutrition.protein}
              </span>
            </div>
            <div className="flex justify-between">
              <span>지방</span>
              <span className="text-grey-normalActive">{nutrition.fat}</span>
            </div>
            <div className="flex justify-between">
              <span>비타민</span>
              <span className="text-grey-normalActive">
                {nutrition.vitamin}
              </span>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* 알레르기 유발 성분 */}
          <p className="mb-2 font-medium text-grey-normal">
            알레르기 유발 성분
          </p>
          <p className="mb-4 text-sm">{allergens.join(",")}</p>

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
