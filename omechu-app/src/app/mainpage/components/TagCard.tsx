import { useTagStore } from "@/lib/stores/tagData.store";
import React from "react";

export default function TagCard() {
  const { mealTimeTag, purposeTag, moodTag, whoTag, budgetTag } = useTagStore();
  return (
    <div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 font-semibold text-grey-normal">
          {mealTimeTag?.tag}
        </span>
        <span>{mealTimeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 font-semibold text-grey-normal">
          {purposeTag?.tag}
        </span>
        <span>{purposeTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 font-semibold text-grey-normal">
          {moodTag?.tag}
        </span>
        <span>{moodTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 font-semibold text-grey-normal">
          {whoTag?.tag}
        </span>
        <span>{whoTag?.description}</span>
      </div>
      <div className="mb-1 flex flex-col p-1 text-sm text-[#393939]">
        <span className="mb-1 font-semibold text-grey-normal">
          {budgetTag?.tag}
        </span>
        <span>{budgetTag?.description}</span>
      </div>
    </div>
  );
}
