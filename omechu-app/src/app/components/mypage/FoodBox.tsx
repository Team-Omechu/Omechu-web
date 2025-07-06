import Image from "next/image";

type FoodBoxProp = {
  content: string;
};

export default function FoodBox({ content }: FoodBoxProp) {
  return (
    <>
      <div className="relative py-1 w-[100px] h-[110px] flex flex-col justify-end items-center border-[1px] border-black rounded-xl bg-white">
        <Image
          className="absolute top-1 right-1"
          src={"/do_not_disturb_on.png"}
          alt={"삭제 아이콘"}
          width={25}
          height={25}
        />
        <div className="bg-gray-300 w-[70px] h-[70px]"></div>
        <span className="text-[15px] font-normal ">{content}</span>
      </div>
    </>
  );
}
