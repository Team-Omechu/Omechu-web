import Image from "next/image";
import { FoodItemType } from "@/app/constant/restautantFoodList";

type FoodCardProps = {
  item: FoodItemType; // 타입은 foodItems 데이터 구조에 맞게 정의
  onClick: () => void;
};

export default function FoodCard({ item, onClick }: FoodCardProps) {
  return (
    <div 
      className="border border-black rounded-xl shadow-md bg-white p-3 flex justify-between items-start"
      onClick={onClick}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span>{item.name}</span>
          <span className="flex items-center gap-1 text-yellow-500 text-xs font-normal">
            ⭐ {item.rating}
            <span className="text-yellow-500">({item.reviews})</span>
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-3">{item.address}</p>
        <p className="text-blue-600 font-bold text-sm mb-1">{item.menu}</p>
        <div className="flex gap-2 flex-wrap mt-1 text-xs">
          {item.tags.map((tag, i) => (
            <span
              key={i}
              className="border border-blue-400 text-blue-400 rounded-full px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col place-items-end gap-2">
        <button>
          <Image src={'/Heart.svg'} alt="하트" width={20} height={20} />
        </button>
        <Image
          src={item.image}
          alt={item.menu}
          width={70}
          height={70}
          className="w-[4.5rem] h-[4.5rem] object-contain rounded-sm border border-gray-200"
        />
      </div>
    </div>
  );
}
