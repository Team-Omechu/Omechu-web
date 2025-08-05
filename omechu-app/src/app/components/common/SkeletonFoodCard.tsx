export default function SkeletonFoodCard() {
  return (
    <div className="flex flex-row items-start w-full gap-4 p-4 bg-gray-100 rounded-lg animate-pulse">
      {/* 좌측: 텍스트 영역 */}
      <div className="flex flex-col flex-1 gap-2">
        {/* 식당명, 별점, 하트 */}
        <div className="flex items-center gap-2">
          <div className="w-32 h-5 bg-gray-200 rounded" /> {/* 식당명 */}
          <div className="w-10 h-4 bg-gray-200 rounded" />
          <div className="w-5 h-5 ml-auto bg-gray-200 rounded-full" />
          {/* 하트 */}
        </div>
        {/* 주소 */}
        <div className="w-1/2 h-4 bg-gray-200 rounded" />
        {/* 대표메뉴 */}
        <div className="w-16 h-4 mt-2 bg-gray-200 rounded" />
      </div>
      {/* 우측: 미리보기 이미지 */}
      <div className="w-20 h-20 bg-gray-200 rounded-md shrink-0" />
    </div>
  );
}
