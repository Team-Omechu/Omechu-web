import Image from "next/image";

type AlertModalProps = {
  onClose: () => void;
  onExit: () => void;
};

export default function AlertModal({ onClose, onExit }: AlertModalProps) {
  return (
    <div className="flex flex-col px-5 pt-4 pb-6 gap-4 justify-between bg-white w-[335px] h-[200px] border-[1px] border-black rounded-[20px]">
      <div className="flex justify-end">
        <button onClick={onClose}>
          <Image
            src={"/close_button.png"}
            alt={"close"}
            width={18}
            height={18}
          />
        </button>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[19px] font-medium">
          기본 상태 입력을 중단하시겠어요?
        </span>
        <span className="text-[15px] text-[#828282] font-medium">
          지금까지 작성한 내용은 저장되지 않아요.
        </span>
      </div>
      <div className="flex justify-center gap-2.5">
        <button
          onClick={onExit}
          className="w-32 h-10 rounded-[30px] p-2.5 text-white active:bg-[#c93938] hover:bg-[#e2403f] bg-[#FB4746] items-center flex justify-center text-[15px] font-normal"
        >
          그만하기
        </button>
        <button
          onClick={onClose}
          className="w-32 h-10 rounded-[30px] p-2.5 bg-white hover:bg-[#f1f1f1] active:bg-[#e2e2e2] border-[1px] border-black items-center flex justify-center text-[15px] font-normal"
        >
          취소
        </button>
      </div>
    </div>
  );
}
