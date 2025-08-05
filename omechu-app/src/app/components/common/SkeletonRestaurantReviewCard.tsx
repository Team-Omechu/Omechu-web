export default function SkeletonRestaurantReviewCard() {
  return (
    <div className="animate-pulse">
      <section className="p-4 bg-white h-fit w-80 rounded-xl">
        <div className="flex justify-between w-full h-20 gap-3">
          {/* 식당 사진 (정사각형) */}
          <div className="h-[70px] w-[70px] rounded-md bg-gray-200" />
          {/* 식당 이름 & 평점 */}
          <div className="flex flex-col flex-1 pt-1 max-h-20">
            <div className="flex items-center flex-1">
              <div className="w-24 h-6 bg-gray-200 rounded" /> {/* 식당명 */}
            </div>
          </div>
          {/* 추천 수 | 찜 버튼 */}
          <div className="flex items-start flex-shrink-0 gap-1 pt-1 h-fit">
            <div className="w-6 h-5 bg-gray-200 rounded" /> {/* 추천수 */}
            <div className="w-5 h-5 bg-gray-200 rounded-full" /> {/* 찜 버튼 */}
          </div>
        </div>
        {/* 리뷰 내용 */}
        <div className="px-1 py-2">
          <div className="w-3/4 h-5 bg-gray-200 rounded" />
        </div>
        {/* 태그 3개 */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-16 h-6 bg-gray-200 rounded-3xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
