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

export default function AlertModal({
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
    <div className="flex h-fit w-[22rem] flex-col justify-between rounded-[20px] border-2 border-grey-darker bg-white px-6 pb-5 pt-14 shadow-xl">
      {/* 상단 여백용 (닫기 버튼 등 들어갈 자리, 현재 비어있음) */}
      <div className="flex justify-end"></div>

      {/* 타이틀 및 설명 영역 */}
      <div className="flex flex-col items-center text-center">
        <span className="whitespace-pre-line text-xl font-medium">{title}</span>
        {description && (
          <span className="mt-1 whitespace-pre-line text-[15px] font-medium text-grey-normalActive">
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
                className="h-10 flex-1 rounded-[30px] border-[1px] border-grey-darkHover bg-white pt-1 text-[15px] font-normal text-grey-darkHover hover:bg-grey-lightHover active:bg-grey-lightActive"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`h-10 rounded-[30px] bg-primary-normal pt-1 text-[15px] font-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive ${showCancelButton ? "flex-1" : "w-40"}`}
            >
              {confirmText}
            </button>
          </>
        ) : (
          // 버튼 순서: [확인] [취소] (기본)
          <>
            <button
              onClick={onConfirm}
              className={`h-10 rounded-[30px] bg-primary-normal text-[15px] font-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive ${showCancelButton ? "flex-1" : "w-40"}`}
            >
              {confirmText}
            </button>
            {showCancelButton && (
              <button
                onClick={onClose}
                className="h-10 flex-1 rounded-[30px] border-2 border-black bg-white text-[15px] font-normal hover:bg-grey-lightHover active:bg-grey-lightActive"
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
