import Image from "next/image";
import MainLoading from "@/components/mainpage/MainLoading";
import { useRouter } from "next/navigation";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import useGetRandomMenu from "../hooks/useGetRandomMenu";

type ModalProps = {
  confirmText: string;
  retryText: string;
  onClose: () => void;
};
export default function RandomRecommendModal({
  confirmText,
  retryText,
  onClose,
}: ModalProps) {
  const router = useRouter();
  const { data, isLoading, isRefetching, refetch } = useGetRandomMenu(); // 로딩이랑 리패칭 추가하기

  const menu = data;
  const { setKeyword } = useLocationAnswerStore();

  const handleConfirm = () => {
    if (!menu) {
      refetch();
      return;
    }
    setKeyword(menu.name);
    router.push(`/mainpage/result/${encodeURIComponent(menu.name)}?record=1`);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading || isRefetching) {
    return <MainLoading />;
  }
  return (
    <div className="relative flex h-[300px] w-[300px] flex-col justify-between rounded-[20px] bg-white p-5 shadow-xl">
      <button className="absolute right-4 top-4" onClick={onClose}>
        <Image src={"/x/close_big.svg"} alt="취소버튼" width={18} height={18} />
      </button>
      <div className="flex flex-col items-center text-center text-[#00A3FF]">
        <span className="whitespace-pre-line text-[19px] font-semibold">
          {menu?.name}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <Image
          src={menu?.image_link || "/image/image_empty.svg"}
          alt="랜덤추천메뉴"
          width={120}
          height={120}
        />
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-grey-dark-hover bg-white text-[15px] font-normal hover:bg-grey-light-hover active:bg-grey-light-active"
          onClick={handleRetry}
        >
          {retryText}
        </button>
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-grey-dark-hover bg-primary-normal text-[15px] font-normal text-white hover:bg-primary-normal-hover active:bg-primary-normal-active"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
