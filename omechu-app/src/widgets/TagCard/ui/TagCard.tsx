import { useTagStore } from "@/entities/tag/model/tagData.store";
import React from "react";

export function TagCard() {
  const { mealTimeTag, purposeTag, moodTag, whoTag, budgetTag } = useTagStore();
  return (
    <div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="text-grey-normal mb-1 font-semibold">
          {mealTimeTag?.tag}
        </span>
        <span>{mealTimeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="text-grey-normal mb-1 font-semibold">
          {purposeTag?.tag}
        </span>
        <span>{purposeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="text-grey-normal mb-1 font-semibold">
          {moodTag?.tag}
        </span>
        <span>{moodTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="text-grey-normal mb-1 font-semibold">
          {whoTag?.tag}
        </span>
        <span>{whoTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="text-grey-normal mb-1 font-semibold">
          {budgetTag?.tag}
        </span>
        <span>{budgetTag?.description}</span>
      </div>
    </div>
  );
}
