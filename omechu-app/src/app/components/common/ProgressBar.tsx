type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  onCancelClick?: () => void;
  cancelButtonText?: string;
  cancelButtonAlign?: "left" | "right"; // 버튼 정렬을 위한 prop
  cancelButtonClassName?: string; // 버튼에 추가 클래스를 주기 위한 prop
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  onCancelClick,
  cancelButtonText = "그만하기",
  cancelButtonAlign = "right", // 기본 정렬을 'right'로 설정
  cancelButtonClassName = "",
}: ProgressBarProps) {
  const alignClass =
    cancelButtonAlign === "right" ? "justify-end" : "justify-start";

  return (
    <div className={`flex flex-col w-full px-5`}>
      <div className="flex gap-1.5 pt-4 pb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-3xl border-[1.5px] border-[#1F9BDA] ${
              index < currentStep
                ? `bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]`
                : "bg-white"
            }`}
          />
        ))}
      </div>

      {onCancelClick && (
        <div className={`flex ${alignClass}`}>
          <button
            onClick={onCancelClick}
            className={`w-auto h-6 px-2 pt-1 text-white text-xs font-light rounded-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae] ${cancelButtonClassName}`}
          >
            {cancelButtonText}
          </button>
        </div>
      )}
    </div>
  );
}
