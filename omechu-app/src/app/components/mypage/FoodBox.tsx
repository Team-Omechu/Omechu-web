import Image from "next/image";

type FoodBoxProp = {
  title: string;
  isExcluded: boolean;
  onToggle: () => void;
};

export default function FoodBox({ title, isExcluded, onToggle }: FoodBoxProp) {
  return (
    <div
      className="relative py-1 w-[100px] h-[110px] 
        flex flex-col justify-end items-center 
        border-[1px] border-black rounded-xl bg-white 
        hover:scale-110 transition-transform duration-300"
    >
      {/* <img
        decoding="async"
        loading="eager"
        onClick={() => {
          console.log("클릭됨", title);
          onToggle();
        }}
        className="absolute cursor-pointer top-1 right-1"
        src={isExcluded ? `/add_circle.webp` : `/do_not_disturb_on.webp`}
        alt={isExcluded ? "음식 추천 제외 취소" : "음식 추천 제외"}
        width={25}
        height={25}
      /> */}
      <Image
        priority
        loading="eager"
        unoptimized
        onClick={() => {
          console.log("클릭됨", title);
          onToggle();
        }}
        className="absolute cursor-pointer top-1 right-1"
        src={isExcluded ? `/add_circle.webp` : `/do_not_disturb_on.webp`}
        alt={isExcluded ? "음식 추천 제외 취소" : "음식 추천 제외"}
        width={25}
        height={25}
        sizes="25px"
      />
      <div className="bg-gray-200 w-[70px] h-[70px] rounded-lg" />
      <span className="text-[15px] font-normal">{title}</span>
    </div>
  );
}
