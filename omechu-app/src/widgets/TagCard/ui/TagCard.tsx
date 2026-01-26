import { useTagStore } from "@/entities/tag/model/tagData.store";
import React from "react";

export function TagCard() {
  const { mealTimeTag, purposeTag, moodTag, whoTag, budgetTag } = useTagStore();
  return (
    <div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 text-[1.125rem] font-semibold text-[#A8A8A8]">
          {mealTimeTag?.tag}
        </span>
        <span>{mealTimeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 text-[1.125rem] font-semibold text-[#A8A8A8]">
          {purposeTag?.tag}
        </span>
        <span>{purposeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 text-[1.125rem] font-semibold text-[#A8A8A8]">
          {moodTag?.tag}
        </span>
        <span>{moodTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 text-[1.125rem] font-semibold text-[#A8A8A8]">
          {whoTag?.tag}
        </span>
        <span>{whoTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 text-[1.125rem] font-semibold text-[#A8A8A8]">
          {budgetTag?.tag}
        </span>
        <span>{budgetTag?.description}</span>
      </div>
    </div>
  );
}
