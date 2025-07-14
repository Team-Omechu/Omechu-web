// InfoRow : 각 항목의 라벨과 내용을 보여주는 역할
type InfoProps = {
  label: string; // "성별", "운동 상태" 같은 라벨
  content: string | string[]; // 실제 내용은 문자열 or 배열
};

export default function InfoRow({ label, content }: InfoProps) {
  // content가 배열 => 쉼표로 join
  // 문자열이면 그대로
  // 아무것도 없으면 "None"
  const displayContent =
    Array.isArray(content) && content.length > 0
      ? content.join(", ")
      : typeof content === "string" && content !== ""
        ? content
        : "None";

  // 비어있는 상태인지 확인해서 스타일 다르게 적용하려고 따로 변수 지정
  const isEmpty = displayContent === "None";

  return (
    <div className="flex items-start gap-6">
      {/* 왼쪽 라벨 박스: 성별, 운동 상태 등 */}
      <div
        className="w-32 h-10 px-1 flex justify-center items-center
                  border-[1px] border-[#393939] rounded-md 
                  bg-[#F5F5F5] dark:bg-[#7a7a7a]"
      >
        {label}
      </div>

      {/* 오른쪽 내용 박스: 실제 유저 입력 정보 or None */}
      <div
        className={`flex-1 mt-2 text-base font-normal break-words whitespace-pre-wrap ${
          isEmpty
            ? "text-[#a3a3a3] dark:text-[#fcdcdc] font-bold" // 입력 안 된 경우: 흐리게 표시
            : "text-[#393939] dark:text-white font-bold" // 입력된 경우: 진하게 표시
        }`}
      >
        {displayContent}
      </div>
    </div>
  );
}
