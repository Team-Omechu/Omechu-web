import Image from "next/image";

type AlertModalProps = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
};

export default function AlertModal({
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onClose,
}: AlertModalProps) {
  return (
    <div className="flex flex-col px-5 pt-4 pb-6 gap-4 justify-between bg-white w-[335px] h-[200px] border-[1px] border-black rounded-[20px]">
      <div className="flex justify-end">
        <button onClick={onClose}>
          <Image src="/close_button.png" alt="close" width={18} height={18} />
        </button>
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-[19px] font-medium">{title}</span>
        {description && (
          <span className="text-[15px] text-[#828282] font-medium mt-1">
            {description}
          </span>
        )}
      </div>
      <div className="flex justify-center gap-2.5">
        <button
          onClick={onConfirm}
          className="w-32 h-10 rounded-[30px] p-2.5 text-white active:bg-[#c93938] hover:bg-[#e2403f] bg-[#FB4746] flex items-center justify-center text-[15px] font-normal"
        >
          {confirmText}
        </button>
        <button
          onClick={onClose}
          className="w-32 h-10 rounded-[30px] p-2.5 bg-white hover:bg-[#f1f1f1] active:bg-[#e2e2e2] border-[1px] border-black flex items-center justify-center text-[15px] font-normal"
        >
          {cancelText}
        </button>
      </div>
    </div>
  );
}
