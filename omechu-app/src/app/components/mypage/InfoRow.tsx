type InfoProps = {
  label: string;
  content: string | string[];
};

export default function InfoRow({ label, content }: InfoProps) {
  const displayContent =
    Array.isArray(content) && content.length > 0
      ? content.join(" ")
      : typeof content === "string" && content !== "None"
        ? content
        : "None";

  const isEmpty = displayContent === "None";

  return (
    <div className="flex items-start gap-6">
      <div
        className={`w-32 h-10 px-1 flex justify-center items-center
                    border-[1px] border-[#393939] rounded-md 
                  bg-[#F5F5F5] dark:bg-[#7a7a7a]`}
      >
        {label}
      </div>
      <div
        className={`flex-1 mt-1.5 text-base font-normal ${
          isEmpty ? "text-[#a3a3a3]" : "text-[#393939]"
        }`}
      >
        {displayContent}
      </div>
    </div>
  );
}
