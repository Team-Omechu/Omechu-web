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
    <div
      className="w-[335px] h-[180px] flex flex-col justify-between p-5 
                    shadow-xl rounded-[20px]
                    bg-white dark:bg-[#a3a3a3]"
    >
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
          className={`h-10 rounded-[30px] text-white text-[15px] font-normal
                    bg-[#FB4746] dark:bg-[#bc3535]
                    hover:bg-[#e2403f] dark:hover:bg-[#972b2a]
                    active:bg-[#c93938] dark:active:bg-[#71201f]
                    ${showCancelButton ? "flex-1" : "w-40"}`}
        >
          {confirmText}
        </button>
        {showCancelButton && (
          <button
            onClick={onClose}
            className="flex-1 h-10 text-[15px] font-normal
                      rounded-[30px] border-black border-2 dark:border-none
                      bg-white dark:bg-[#7a7a7a]
                      hover:bg-[#f1f1f1] dark:hover:bg-[#626262]
                      active:bg-[#e2e2e2] dark:active:bg-[#494949]"
          >
            {cancelText}
          </button>
        )}
      </div>
    </div>
  );
}
