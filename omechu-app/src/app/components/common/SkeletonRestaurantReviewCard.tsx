export default function SkeletonRestaurantReviewCard() {
  return (
    <div className="animate-pulse">
      <section className="h-fit w-80 rounded-xl bg-white p-4">
        <div className="flex h-20 w-full justify-between gap-3">
          {/* 식당 사진 (정사각형) */}
          <div className="h-[70px] w-[70px] rounded-md bg-gray-200" />
          {/* 식당 이름 & 평점 */}
          <div className="flex max-h-20 flex-1 flex-col pt-1">
            <div className="flex flex-1 items-center">
              <div className="h-6 w-24 rounded bg-gray-200" /> {/* 식당명 */}
            </div>
          </div>
          {/* 추천 수 | 찜 버튼 */}
          <div className="flex h-fit flex-shrink-0 items-start gap-1 pt-1">
            <div className="h-5 w-6 rounded bg-gray-200" /> {/* 추천수 */}
            <div className="h-5 w-5 rounded-full bg-gray-200" /> {/* 찜 버튼 */}
          </div>
        </div>
        {/* 리뷰 내용 */}
        <div className="px-1 py-2">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
        </div>
        {/* 태그 3개 */}
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-6 w-16 rounded-3xl bg-gray-200" />
          ))}
        </div>
      </section>
    </div>
  );
}
