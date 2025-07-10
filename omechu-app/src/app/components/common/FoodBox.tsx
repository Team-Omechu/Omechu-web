import Image from "next/image";

type FoodBoxProp = {
  title: string;
  imageUrl?: string | null; // 실제 서비스에서는 이미지 경로 들어옴
  isExcluded: boolean;
  isToggled?: boolean;
  onToggle: () => void;
  onClick: () => void;
};

export default function FoodBox({
  title,
  imageUrl,
  isExcluded,
  isToggled = true,
  onToggle,
  onClick
}: FoodBoxProp) {
  // console.log(`[FoodBox] title: ${title}, imageUrl: ${imageUrl}`);  // 디버그용 콘솔 메세지 출력
  return (
    <div
      className="relative py-1 w-[100px] h-[110px] 
        flex flex-col justify-end items-center 
        border-[1px] border-black rounded-xl bg-white 
        hover:scale-110 transition-transform duration-300
        cursor-pointer"
      onClick={onClick}
    >
      {/* 추천 제외 || 복원 버튼 */}
      {/* dev 모드 일 때 이미지 렌더링 늦음 -> build 후 확인하니 렌더링 정상 (캐시 사용) */}
      {isToggled && (
        <Image
          priority
          loading="eager"
          unoptimized
          onClick={(e) => {
            // console.log("클릭됨", title); // 디버그용 콘솔 메세지 출력
            e.stopPropagation();
            onToggle();
          }}
          className="absolute cursor-pointer top-1 right-1"
          src={isExcluded ? `/add_circle.webp` : `/do_not_disturb_on.webp`}
          alt={isExcluded ? "음식 추천 제외 취소" : "음식 추천 제외"}
          width={25}
          height={25}
          sizes="25px"
        />
      )}
      {/* 음식 이미지 (또는 fallback) */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${title} 이미지`}
          width={70}
          height={70}
          className="object-cover rounded-lg"
        />
      ) : (
        <div className="bg-gray-200 w-[70px] h-[70px] rounded-lg" />
      )}
      {/* 음식 이름 */}
      <span className="text-[15px] font-normal">{title}</span>
    </div>
  );
}
