// -------------------------------------------
// [공용 컴포넌트] AlertModal 사용법
// -------------------------------------------
//* title: 모달 제목 (필수)
// description: 설명 문구 (선택)
//* confirmText: 확인 버튼 텍스트 (기본값: "확인")
//* 주황색 버튼이 confirm이라고 보면 됨
//* cancelText: 취소 버튼 텍스트 (이 값이 있어야 버튼이 보임)
//* onConfirm: 확인 버튼 눌렀을 때 실행할 함수
//* onClose: 취소 버튼 눌렀을 때 실행할 함수 (선택)
// iconSrc: 아이콘 이미지 경로 (현재는 사용하지 않지만 props로 남겨둠)
//* swapButtonOrder: true로 설정하면 [취소] [확인] 순서로 바뀜
//
// 기본 순서: [확인] [취소]
//* 버튼 순서 바꾸고 싶으면:
// <AlertModal swapButtonOrder={true} ... />
//
// 사용 예시:
// <AlertModal
//   title="삭제하시겠어요?"
//   description="삭제하면 복구할 수 없습니다."
//   confirmText="삭제하기"
//   cancelText="취소"
//   onConfirm={handleDelete}
//   onClose={closeModal}
// />
// -------------------------------------------

type AlertModalProps = {
  title: string;
  description?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose?: () => void;
  iconSrc?: string;
  swapButtonOrder?: boolean;
};

export function AlertModal({
  title,
  description,
  confirmText = "확인",
  cancelText,
  onConfirm,
  onClose,
  swapButtonOrder = false,
}: AlertModalProps) {
  const showCancelButton = !!cancelText;

  return (
    <div className="flex h-fit w-88 flex-col justify-between rounded-[20px] bg-white px-6 pt-14 pb-5 shadow-xl">
      {/* 상단 여백용 (닫기 버튼 등 들어갈 자리, 현재 비어있음) */}
      <div className="flex justify-end"></div>

      {/* 타이틀 및 설명 영역 */}
      <div className="flex flex-col items-center text-center">
        <span className="text-xl font-medium whitespace-pre-line">{title}</span>
        {description && (
          <span className="text-grey-normal-active mt-3 text-[15px] font-medium whitespace-pre-line">
            {description}
          </span>
        )}
      </div>

      {/* 확인/취소 버튼 영역 */}
      <div className="flex justify-center gap-3 p-4">
        {swapButtonOrder ? (
          // 버튼 순서: [취소] [확인]
          <>
            {showCancelButton && (
              <button
                onClick={onClose}
                className="border-grey-dark-hover text-grey-dark-hover hover:bg-grey-light-hover active:bg-grey-light-active h-10 flex-1 rounded-[30px] border bg-white text-[15px] font-normal"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active h-10 rounded-[30px] text-[15px] font-normal text-white ${showCancelButton ? "flex-1" : "w-40"}`}
            >
              {confirmText}
            </button>
          </>
        ) : (
          // 버튼 순서: [확인] [취소] (기본)
          <>
            <button
              onClick={onConfirm}
              className={`bg-primary-normal hover:bg-primary-normal-hover active:bg-primary-normal-active h-10 rounded-[30px] text-[15px] font-normal text-white ${showCancelButton ? "flex-1" : "w-40"}`}
            >
              {confirmText}
            </button>
            {showCancelButton && (
              <button
                onClick={onClose}
                className="border-grey-dark-hover hover:bg-grey-light-hover active:bg-grey-light-active h-10 flex-1 rounded-[30px] border-2 bg-white text-[15px] font-normal"
              >
                {cancelText}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
