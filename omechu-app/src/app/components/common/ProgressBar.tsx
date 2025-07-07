type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  onCancelClick?: () => void;
  cancelButtonText?: string;
};

export default function ProgressBar({
  currentStep,
  totalSteps,
  onCancelClick,
  cancelButtonText = "그만하기",
}: ProgressBarProps) {
  return (
    <div className="flex flex-col w-full px-5">
      <div className="flex gap-1.5 pt-4 pb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-3xl border-[1.5px] border-[#1F9BDA] ${
              index < currentStep
                ? `bg-[#1f9bda] dark:bg-[#1774a4]
                    hover:bg-[#1c8cc4] dark:hover:bg-[#135d83]
                    active:bg-[#197cae] dark:active:bg-[#0e4662]`
                : "bg-white"
            }`}
          />
        ))}
      </div>

      {onCancelClick && (
        <div className="flex justify-start">
          <button
            onClick={onCancelClick}
            className="w-[62px] h-6 px-2 text-white text-xs font-light rounded-md
                      bg-[#1f9bda] dark:bg-[#1774a4]
                      hover:bg-[#1c8cc4] dark:hover:bg-[#135d83]
                      active:bg-[#197cae] dark:active:bg-[#0e4662]"
          >
            {cancelButtonText}
          </button>
        </div>
      )}
    </div>
  );
}
