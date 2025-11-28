/* eslint-disable @next/next/no-img-element */
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
  onClick,
}: FoodBoxProp) {
  // 디버그용 콘솔 메세지 출력
  console.log(`[FoodBox] title: ${title}, imageUrl: ${imageUrl}`);
  return (
    <div
      className="border-grey-dark-hover relative flex h-[130px] w-[100px] cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border bg-white py-3 transition-transform duration-300 hover:scale-110"
      onClick={onClick}
    >
      {/* 추천 제외 || 복원 버튼 */}
      {/* dev 모드 일 때 이미지 렌더링 늦음 -> build 후 확인하니 렌더링 정상 (캐시 사용) */}
      {isToggled && (
        <img
          loading="eager"
          onClick={(e) => {
            // console.log("클릭됨", title); // 디버그용 콘솔 메세지 출력
            e.stopPropagation();
            onToggle();
          }}
          className="absolute top-1 right-1 flex-1 cursor-pointer"
          src={
            isExcluded ? `/circle/circle_plus.svg` : `/circle/circle_minus.svg`
          }
          alt={isExcluded ? "음식 추천 제외 취소" : "음식 추천 제외"}
          width={25}
          height={25}
          sizes="25px"
        />
      )}
      {/* 음식 이미지 (또는 fallback) */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${title} 이미지`}
          width={70}
          height={70}
          className="flex-1 shrink-0 rounded-lg object-cover"
        />
      ) : (
        <div className="h-[70px] w-[70px] rounded-lg bg-gray-200" />
      )}
      {/* 음식 이름 */}
      <div
        className="line-clamp-2 flex max-h-[40px] min-h-[28px] items-center px-3 text-center text-sm leading-tight font-normal"
        title={title}
      >
        {title}
      </div>
    </div>
  );
}
