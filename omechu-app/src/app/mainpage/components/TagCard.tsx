import React from "react";

interface TagCardProps {
  tag: string;
  description: string;
}

export default function TagCard({ tag, description }: TagCardProps) {
  return (
    <div className="mb-1 flex flex-col p-1 text-black text-sm">
      <span className="mb-1 font-semibold text-[#A3A3A3]">{tag}</span>
      <span>{description}</span>
    </div>
  );
}
