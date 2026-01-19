import { BaseModal } from "@/shared";

type TimePickerModalProps = {
  open: boolean;
  time: string;
  onChangeTime: (time: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export const TimePickerModal = ({
  open,
  time,
  onChangeTime,
  onConfirm,
  onCancel,
}: TimePickerModalProps) => {
  if (!open) return null;

  return (
    <>
      <BaseModal
        title="알림 시간 정하기"
        isCloseButtonShow={false}
        leftButtonText="취소"
        rightButtonText="확인"
        onLeftButtonClick={onCancel}
        onRightButtonClick={onConfirm}
      >
        <div className="mt-4 flex w-full justify-center">
          <input
            type="time"
            value={time}
            onChange={(e) => onChangeTime(e.target.value)}
            className="border-font-disabled text-body-2-regular w-2/3 rounded-[10px] border px-5 py-2"
          />
        </div>
      </BaseModal>
    </>
  );
};
