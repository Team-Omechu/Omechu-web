import Image from "next/image";

export default function FoodieBox() {
  return (
    <div className="h-32 w-24 rounded-xl border-[1px] border-[#393939] bg-white">
      {/* 메뉴 이름 */}
      <span>짜장면</span>
      {/* 메뉴 이미지 */}
      <Image
        src="/image/image_empty.svg"
        alt="메뉴 이미지"
        width={70}
        height={70}
      />
      {/* 먹부림 횟수 */}
      <div>
        <span>0</span>
        <span>회</span>
      </div>
    </div>
  );
}
