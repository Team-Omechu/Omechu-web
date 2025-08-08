import Image from "next/image";
import useGetRecommendMenu from "../hooks/useGetRecommendMenu";
import { MenuItem } from "@/constant/mainpage/resultData";
import MainLoading from "@/components/mainpage/MainLoading";
import { useRouter } from "next/navigation";
import { useLocationAnswerStore } from "@/lib/stores/locationAnswer.store";
import usePostMukburim from "../hooks/usePostMukburim";

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
  const { data, isLoading, error, refetch, isRefetching } =
    useGetRecommendMenu();
  const { mutate } = usePostMukburim();
  const menus: MenuItem[] = Array.isArray(data) ? data : [];
  const randomMenu = menus[Math.floor(Math.random() * menus.length)];
  const { setKeyword } = useLocationAnswerStore();

  const handleConfirm = () => {
    if (randomMenu) {
      router.push(`/mainpage/result/${randomMenu.menu}`);
    }
    setKeyword(randomMenu.menu);
    mutate(randomMenu.menu);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading || isRefetching) {
    return <MainLoading />;
  }
  return (
    <div className="relative flex h-[300px] w-[300px] flex-col justify-between rounded-[20px] bg-white p-5 shadow-xl dark:bg-grey-normal">
      <button className="absolute right-4 top-4" onClick={onClose}>
        <Image src={"/x/close_big.svg"} alt="취소버튼" width={18} height={18} />
      </button>
      <div className="flex flex-col items-center text-center text-[#00A3FF]">
        <span className="whitespace-pre-line text-[19px] font-semibold">
          {randomMenu.menu}
        </span>
      </div>
      <div className="flex flex-col items-center">
        <Image
          src={randomMenu.image_link || "/image/image_empty.svg"}
          alt="랜덤추천메뉴"
          width={120}
          height={120}
        />
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-black bg-white text-[15px] font-normal hover:bg-grey-lightHover active:bg-grey-lightActive dark:border-none dark:bg-grey-dark dark:hover:bg-grey-darkHover dark:active:bg-grey-darkActive"
          onClick={handleRetry}
        >
          {retryText}
        </button>
        <button
          className="flex-shrik-0 h-[45px] w-[100px] rounded-md border border-black bg-primary-normal text-[15px] font-normal text-white hover:bg-primary-normalHover active:bg-primary-normalActive"
          onClick={handleConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
