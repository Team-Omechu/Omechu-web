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
    <div className="flex h-[180px] w-[335px] flex-col justify-between rounded-[20px] bg-white p-5 shadow-xl dark:bg-[#a3a3a3]">
      <div className="flex justify-end"></div>
      <div className="flex flex-col items-center text-center">
        <span className="text-[19px] font-medium">{title}</span>
        {description && (
          <span className="mt-1 text-[15px] font-medium text-[#828282] dark:text-white">
            {description}
          </span>
        )}
      </div>
      <div className="flex justify-center gap-2.5">
        <button
          onClick={onConfirm}
          className={`h-10 rounded-[30px] bg-[#FB4746] text-[15px] font-normal text-white hover:bg-[#e2403f] active:bg-[#c93938] dark:bg-[#bc3535] dark:hover:bg-[#972b2a] dark:active:bg-[#71201f] ${showCancelButton ? "flex-1" : "w-40"}`}
        >
          {confirmText}
        </button>
        {showCancelButton && (
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-[30px] border-2 border-black bg-white text-[15px] font-normal hover:bg-[#f1f1f1] active:bg-[#e2e2e2] dark:border-none dark:bg-[#7a7a7a] dark:hover:bg-[#626262] dark:active:bg-[#494949]"
          >
            {cancelText}
          </button>
        )}
      </div>
    </div>
  );
}
