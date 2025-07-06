type AlertModalProps = {
  title: string;
  description?: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose?: () => void;
  iconSrc?: string;
};

export default function AlertModal({
  title,
  description,
  confirmText = "확인",
  cancelText,
  onConfirm,
  onClose,
}: AlertModalProps) {
  const showCancelButton = !!cancelText;
  return (
    <div className="w-[335px] h-[200px] bg-white rounded-[20px] p-5 flex flex-col justify-between shadow-xl">
      <div className="flex justify-end"></div>
      <div className="flex flex-col items-center text-center">
        <span className="text-[19px] font-medium">{title}</span>
        {description && (
          <span className="mt-1 text-[15px] text-[#828282] font-medium">
            {description}
          </span>
        )}
      </div>
      <div className="flex justify-center gap-2.5">
        <button
          onClick={onConfirm}
          className={`h-10 rounded-[30px] text-white bg-[#FB4746] hover:bg-[#e2403f] active:bg-[#c93938] text-[15px] font-normal ${showCancelButton ? "flex-1" : "w-40"}`}
        >
          {confirmText}
        </button>
        {showCancelButton && (
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[30px] bg-white border border-black hover:bg-[#f1f1f1] active:bg-[#e2e2e2] text-[15px] font-normal"
          >
            {cancelText}
          </button>
        )}
      </div>
    </div>
  );
}
