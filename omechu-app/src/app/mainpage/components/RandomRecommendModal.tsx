import Header from "@/components/common/Header";
import Image from "next/image";

type ModalProps = {
  title?: string;
  iconSrc: string;
  confirmText: string;
  retryText: string;
  onConfirm: () => void;
  onRetry: () => void;
  onClose: () => void;
};
export default function RandomRecommendModal({
  title,
  iconSrc,
  confirmText,
  retryText,
  onConfirm,
  onRetry,
  onClose,
}: ModalProps) {
  return (
    <div className="relative flex h-[300px] w-[300px] flex-col justify-between rounded-[20px] bg-white p-5 shadow-xl dark:bg-grey-normal">
      <button className="absolute right-4 top-4" onClick={onClose}>
        <Image src={"/x/close_big.svg"} alt="취소버튼" width={18} height={18} />
      </button>
      <div className="flex flex-col items-center text-center text-[#00A3FF]">
        <span className="whitespace-pre-line text-[19px] font-semibold">
          {title}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <Image src={iconSrc} alt="랜덤추천메뉴" width={120} height={120} />
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-black bg-white text-[15px] font-normal hover:bg-grey-lightHover active:bg-grey-lightActive dark:border-none dark:bg-grey-dark dark:hover:bg-grey-darkHover dark:active:bg-grey-darkActive"
          onClick={onRetry}
        >
          {retryText}
        </button>
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-black bg-primary-normal text-[15px] font-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
