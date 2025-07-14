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
      <div className="flex h-10 w-32 items-center justify-center rounded-md border-[1px] border-[#393939] bg-[#F5F5F5] px-1 dark:bg-[#7a7a7a]">
        {label}
      </div>

      {/* 오른쪽 내용 박스: 실제 유저 입력 정보 or None */}
      <div
        className={`mt-2 flex-1 whitespace-pre-wrap break-words text-base font-normal ${
          isEmpty
            ? "font-bold text-[#a3a3a3] dark:text-[#fcdcdc]" // 입력 안 된 경우: 흐리게 표시
            : "font-bold text-[#393939] dark:text-white" // 입력된 경우: 진하게 표시
        }`}
      >
        {displayContent}
      </div>
    </div>
  );
}
