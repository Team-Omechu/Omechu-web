// components/common/SkeletonRestaurantReviewCard.tsx

export default function SkeletonRestaurantReviewCard() {
  return (
    <div>
      {/* Card 위 작성일 | 삭제 버튼 */}
      <section className="flex justify-between px-2 mb-1 text-sm font-normal text-grey-normalActive">
        <div className="w-20 h-4 bg-gray-200 rounded" /> {/* 날짜 */}
        <div className="w-12 h-4 bg-gray-200 rounded" /> {/* 삭제 버튼 */}
      </section>
      <section className="h-fit w-80 rounded-xl border-[1px] border-black bg-white p-4">
        <div className="flex justify-between w-full h-20 gap-3">
          {/* 식당 사진 (정사각형) */}
          <div className="h-[70px] w-[70px] rounded-md bg-gray-200" />
          {/* 식당 이름 & 평점 */}
          <div className="flex flex-col flex-1 pt-1 max-h-20">
            <div className="flex items-center flex-1">
              <div className="w-24 h-6 bg-gray-200 rounded" /> {/* 식당명 */}
              <div className="w-8 h-6 ml-2 bg-gray-200 rounded" />{" "}
              {/* 이동 버튼 */}
            </div>
            <div className="w-20 h-5 mt-1 bg-gray-200 rounded" /> {/* 별점 */}
          </div>
          {/* 추천 수 | 찜 버튼 */}
          <div className="flex items-start flex-shrink-0 gap-1 pt-1 h-fit">
            <div className="w-6 h-5 bg-gray-200 rounded" /> {/* 추천수 */}
            <div className="w-5 h-5 bg-gray-200 rounded-full" /> {/* 찜 버튼 */}
          </div>
        </div>
        {/* 리뷰 내용 */}
        <div className="px-1 py-2">
          <div className="w-full h-5 mb-1 bg-gray-200 rounded" />
          <div className="w-3/4 h-5 bg-gray-200 rounded" />
        </div>
        {/* 리뷰 이미지들 */}
        <div className="relative flex w-full gap-2 mb-4 overflow-x-scroll max-h-32">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[100px] min-w-[100px] rounded-md bg-gray-200"
            />
          ))}
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
