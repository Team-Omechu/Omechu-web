// -------------------------------------------
// [공용 컴포넌트] ProgressBar 사용법
// -------------------------------------------
//* currentStep: 현재 단계 (0부터 시작)
//* totalSteps: 전체 단계 수
// onCancelClick: 취소 버튼 클릭 시 실행할 함수 (선택)
//* cancelButtonText: 취소 버튼 텍스트 (기본값: "그만하기")
//* cancelButtonAlign: 취소 버튼 정렬 방향 ("left" 또는 "right"), 기본값: "right"
// cancelButtonClassName: 버튼에 커스텀 스타일 클래스 추가할 때 사용
//
// 사용 위치 예시:
// 페이지 상단에 붙여서 다단계 입력폼, 설문, 회원가입 진행도 표시할 때
// onCancelClick만 넘기면 버튼이 자동으로 보임
//
// 예시:
// <ProgressBar
//   currentStep={2}
//   totalSteps={5}
//   onCancelClick={() => router.push("/home")}
//   cancelButtonText="나가기"
//   cancelButtonAlign="left"
//   cancelButtonClassName="text-xs"
// />
// -------------------------------------------

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
    <div className={`flex w-full flex-col px-5`}>
      <div className="flex gap-1.5 pb-3 pt-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-3xl border-[1.5px] border-[#1F9BDA] ${
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
