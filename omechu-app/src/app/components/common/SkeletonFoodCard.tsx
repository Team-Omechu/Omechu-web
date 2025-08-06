export default function SkeletonFoodCard() {
  return (
    <div className="flex w-full animate-pulse flex-row items-start gap-4 rounded-lg bg-gray-100 p-4">
      {/* 좌측: 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-2">
        {/* 식당명, 별점, 하트 */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-32 rounded bg-gray-200" /> {/* 식당명 */}
          <div className="h-4 w-10 rounded bg-gray-200" />
          <div className="ml-auto h-5 w-5 rounded-full bg-gray-200" />
          {/* 하트 */}
        </div>
        {/* 주소 */}
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        {/* 대표메뉴 */}
        <div className="mt-2 h-4 w-16 rounded bg-gray-200" />
      </div>
      {/* 우측: 미리보기 이미지 */}
      <div className="h-20 w-20 shrink-0 rounded-md bg-gray-200" />
    </div>
  );
}
