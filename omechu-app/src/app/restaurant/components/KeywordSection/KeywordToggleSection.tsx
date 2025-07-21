import Image from "next/image";

interface KeywordToggleSectionProps {
  selectedKeywords: string[];
  showKeywords: boolean;
  onToggleShow: () => void;
}

export default function KeywordToggleSection({
  selectedKeywords,
  showKeywords,
  onToggleShow,
}: KeywordToggleSectionProps) {
  return (
    <div className="mb-2 mt-4 flex justify-end">
      {selectedKeywords.length === 0 ? (
        <button
          onClick={onToggleShow}
          className="flex items-center gap-1 rounded-full border border-gray-400 bg-white px-3 py-1 text-xs text-gray-500"
        >
          추천 키워드
          <Image
            src="/arrow/arrow_up.png"
            alt="추천 키워드"
            width={16}
            height={16}
            className={`transition-transform duration-200 ${
              showKeywords ? "rotate-180" : ""
            }`}
          />
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {selectedKeywords.map((tag, idx) => (
            <span
              key={tag}
              className="rounded-full border border-gray-400 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
          <button onClick={onToggleShow}>
            <Image
              src="/arrow/arrow_down.png"
              alt="추천 키워드"
              width={24}
              height={24}
              className={`transition-transform duration-200 ${
                showKeywords ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
}
