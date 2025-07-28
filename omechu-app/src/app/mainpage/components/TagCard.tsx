import { TagData } from "@/constant/mainpage/resultData";
import React from "react";

export default function TagCard({ tag, description }: TagData) {
  return (
    <div className="mb-1 flex flex-col p-1 text-sm text-black">
      <span className="mb-1 font-semibold text-grey-normal">{tag}</span>
      <span>{description}</span>
    </div>
  );
}
