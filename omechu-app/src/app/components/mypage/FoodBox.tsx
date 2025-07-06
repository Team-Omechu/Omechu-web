import { useState } from "react";
import Image from "next/image";

type FoodBoxProp = {
  title: string;
  // isExcluded: boolean;
};

export default function FoodBox({ title }: FoodBoxProp) {
  const [isExcluded, setIsExcluded] = useState(false);
  return (
    <>
      <div
        className="relative py-1 w-[100px] h-[110px] 
          flex flex-col justify-end items-center 
          border-[1px] border-black rounded-xl bg-white 
          hover:scale-110 transition-transform duration-300"
      >
        <Image
          onClick={() => {
            setIsExcluded(true);
          }}
          className="absolute cursor-pointer top-1 right-1"
          src={"/do_not_disturb_on.png"}
          alt={"삭제 아이콘"}
          width={25}
          height={25}
        />
        <div className="bg-gray-200 w-[70px] h-[70px] rounded-lg"></div>
        <span className="text-[15px] font-normal ">{title}</span>
      </div>
    </>
  );
}
