"use client";
// 라이브러리
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

// 컴포넌트 목록
import Header from "@/app/components/common/Header";
import Review from "@/app/components/restaurant/Review";
import ModalWrapper from "@/app/components/common/ModalWrapper";
import ReportModal from "@/app/components/restaurant/ReportModal";
import AlertModal from "@/app/components/common/AlertModal";

//샘플 데이터(일단 상수파일로 관리)
import { restaurantList } from "@/app/constant/restaurant/restaurantList";
import { sampleReviews } from "@/app/constant/restaurant/sampleReviews";
import {
  reviewSummary,
  reviewTags,
} from "@/app/constant/restaurant/reviewSummary";

export default function RestaurantDetail() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = Number(searchParams.get("id"));
  const restaurant = restaurantList.find((item) => item.id === id);
  const filteredReviews = sampleReviews.filter(
    (review) => review.restaurantId === restaurant?.id
  );
  const summary = reviewSummary[restaurant?.id ?? 0];
  const parseDate = (dateStr: string) => new Date(dateStr.replace(/\./g, "-"));

  const [showAddress, setShowAddress] = useState(false);
  const [rating, setRating] = useState(0); // 0~5점
  const [activeOptionId, setActiveOptionId] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);

  const [votedReviewIds, setVotedReviewIds] = useState<number[]>([]);
  const [localVotes, setLocalVotes] = useState<Record<number, number>>({});
  // 상태 정의
  const [sortType, setSortType] = useState<"recommend" | "latest">("recommend");

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortType === "recommend") {
      const aVotes = localVotes[a.id] ?? a.votes;
      const bVotes = localVotes[b.id] ?? b.votes;
      return bVotes - aVotes;
    } else {
      return (
        parseDate(b.createdDate).getTime() - parseDate(a.createdDate).getTime()
      );
    }
  });

  // 디버그용 콘솔.로그
  console.log("id:", id);
  console.log("restaurant:", restaurant);
  console.log("filteredReviews:", filteredReviews);
  console.log("summary:", summary);
  sortedReviews.forEach((review) => {
    console.log({
      id: review.id,
      votes: localVotes[review.id] ?? review.votes,
      createdDate: review.createdDate,
      parsed: parseDate(review.createdDate).getTime(),
    });
  });

  return (
    <>
      {/* 헤더 */}
      <Header
        className="border-none"
        title={""}
        leftChild={
          <button
            onClick={() => {
              router.push("./");
            }}
          >
            <Image
              src={"/header_left_arrow.png"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      {/* 메인 Container*/}
      <main className="relative overflow-y-auto px-4 pb-10  gap-3 flex flex-col items-center w-full min-h-[calc(100vh-10rem)]">
        {/* 맛집 제목, 사진 */}
        <section className="flex flex-col items-center justify-between w-full gap-2 mt-3">
          <h1 className="text-2xl font-bold text-[#1F9BDA] text-center">
            {restaurant?.name}
          </h1>
          <div className="flex w-full gap-3 px-4 py-2 overflow-x-auto">
            {restaurant?.images?.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`맛집 사진 ${idx + 1}`}
                width={180}
                height={180}
                className="rounded-lg shrink-0"
              />
            ))}
          </div>
        </section>
        {/* 맛집 정보 */}
        <section
          className="relative flex flex-col items-center w-full p-4
        rounded-md border-[1px] border-[#393939] bg-white gap-3"
        >
          {/* 정보 - 메뉴 종류 */}
          <div className="flex items-center justify-start w-full gap-3">
            <Image
              src="/restaurant_menu.png"
              alt="맛집 메뉴"
              width={24}
              height={24}
            />
            <span className="mt-1 text-lg font-bold text-[#1F9BDA] text-center">
              {restaurant?.category}
            </span>
          </div>
          {/* 구분선 */}
          <div className="bg-[#3d2828] w-full h-[1px] opacity-60"></div>
          {/* 맛집 시간표 */}
          <div className="flex flex-row justify-start w-full gap-5">
            <div className="flex-shrink-0">
              <Image
                className="flex-shrink-0"
                src="/restaurant_time_table.png"
                alt="맛집 시간표"
                width={24}
                height={24}
              />
            </div>
            <div>
              {restaurant?.timetable.map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <h1 className="text-lg font-normal text-[#393939] text-center">
                    {item.days_of_the_week}
                  </h1>
                  <span className="text-base font-normal text-[#828282]">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[1px] opacity-60"></div>
          {/* 주소 */}
          <div className="flex flex-1 gap-3">
            <div className="flex-shrink-0">
              <Image
                className="flex-shrink-0 mb-2"
                src="/restaurant_location.png"
                alt="맛집 위치"
                width={24}
                height={24}
              />
            </div>
            <div className="relative flex flex-col w-full gap-3 mt-1">
              <div className="flex items-start gap-1">
                <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                  도로명
                </span>
                <span className="text-sm font-normal text-[#828282] whitespace-pre-wrap">
                  {restaurant?.address.road}
                </span>
              </div>
              {showAddress && (
                <>
                  <div className="flex items-start gap-1">
                    <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                      지번
                    </span>
                    <span className="text-sm  font-normal text-[#828282] whitespace-pre-wrap">
                      서울 성동구 성수동 123-1 1층
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-sm font-normal text-[#828282] whitespace-pre-wrap">
                      {restaurant?.address.jibun}
                    </span>
                    <span className="text-sm font-normal text-[#828282] whitespace-pre-wrap">
                      {restaurant?.address.postalCode}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="z-10">
              <button
                onClick={() => {
                  setShowAddress((prev) => !prev);
                }}
              >
                <Image
                  src={showAddress ? "/arrow_up.png" : "/arrow_down.png"}
                  alt="상세주소 보기"
                  width={30}
                  height={30}
                />
              </button>
            </div>
          </div>
          <div className="flex justify-end w-full">
            <button
              onClick={() =>
                router.push(`${pathname}/map?id=${restaurant?.id}`)
              }
              className="flex flex-col justify-center items-center w-16 h-6 bg-[#1F9BDA] rounded-3xl"
            >
              <span className="mt-1 text-sm font-normal text-white">
                지도보기
              </span>
            </button>
          </div>
        </section>

        {/* 후기 작성 칸 */}
        <section className="flex flex-col items-center w-full gap-5 mt-5">
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[2px] opacity-40" />
          {/* 별 후기 작성 */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }, (_, index) => {
                const score = index + 1;
                return (
                  <button
                    key={score}
                    onClick={() => setRating(score)}
                    className="text-3xl text-[#1F9BDA] w-fit h-fit"
                  >
                    {score <= rating ? "★" : "☆"}
                  </button>
                );
              })}
            </div>
            <span className="text-[#828282] font-normal text-base">
              후기를 남겨주세요!
            </span>
          </div>
          {/* 구분선 */}
          <div className="bg-[#828282] w-full h-[2px] opacity-40" />
        </section>

        {/* 후기 */}
        <section className="flex flex-col w-full gap-2">
          <div className="flex justify-between px-2 py-2">
            {/* 후기 평점 - 후기 개수 */}
            {summary && (
              <div className="flex w-full px-2 py-2 jubefore:stify-between">
                <div className="flex gap-2 text-[#1F9BDA] text-xl font-medium">
                  <span>{summary.averageRating.toFixed(1)}</span>
                  <span>
                    {"★".repeat(Math.round(summary.averageRating)) +
                      "☆".repeat(5 - Math.round(summary.averageRating))}
                  </span>
                </div>
                <div className="flex gap-1 text-[#828282] text-base font-medium">
                  <span>후기</span>
                  <span className="font-bold">{summary.reviewCount}</span>
                  <span>건</span>
                </div>
              </div>
            )}
          </div>

          {/* 후기 관련 태그 */}
          <div className="flex flex-wrap justify-center gap-1 px-4">
            {(reviewTags[restaurant?.id ?? 0] || []).map((item, index) => (
              <div
                key={index}
                className="mt-1 px-4 py-1 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-nomal hover:scale-105 duration-300"
              >
                {item}
              </div>
            ))}
          </div>

          {/* 후기 카드 목록 */}
          <div className="flex flex-col w-full gap-3 mt-5">
            {/* 후기 필터 버튼 */}
            <div className="flex justify-end gap-2 mr-2 -mb-2 text-sm">
              <button
                className={
                  sortType === "recommend"
                    ? "text-[#393939] font-bold"
                    : "text-[#828282] font-light"
                }
                onClick={() => setSortType("recommend")}
              >
                추천 순
              </button>
              <span>|</span>
              <button
                className={
                  sortType === "latest"
                    ? "text-[#393939] font-bold"
                    : "text-[#828282] font-light"
                }
                onClick={() => setSortType("latest")}
              >
                최신 순
              </button>
            </div>

            {/* 후기 목록 */}
            <div className="flex flex-col gap-4">
              {sortedReviews.map((item, index) => (
                <Review
                  key={index}
                  id={item.id}
                  profileImgUrl={item.profileImgUrl}
                  userId={item.userId}
                  createdDate={item.createdDate}
                  votes={localVotes[item.id] ?? item.votes}
                  rating={item.rating}
                  content={item.content}
                  tags={item.tags}
                  images={item.images}
                  onVote={() => {
                    const hasVoted = votedReviewIds.includes(item.id);
                    if (hasVoted) {
                      setVotedReviewIds((prev) =>
                        prev.filter((id) => id !== item.id)
                      );
                      setLocalVotes((prev) => ({
                        ...prev,
                        [item.id]: (prev[item.id] ?? item.votes) - 1,
                      }));
                    } else {
                      setVotedReviewIds((prev) => [...prev, item.id]);
                      setLocalVotes((prev) => ({
                        ...prev,
                        [item.id]: (prev[item.id] ?? item.votes) + 1,
                      }));
                    }
                  }}
                  isVoted={votedReviewIds.includes(item.id)}
                  onReport={() => setShowReportModal(true)}
                  onClick={() =>
                    setActiveOptionId((prev) =>
                      prev === item.id ? null : item.id
                    )
                  }
                  isOptionOpen={activeOptionId === item.id}
                />
              ))}
            </div>
          </div>
        </section>
        {showReportModal && (
          <>
            <ModalWrapper>
              <ReportModal
                onClick={() => setShowReportModal(false)}
                onReport={() => {
                  setShowReportCompleteModal(true);
                  setShowReportModal(false);
                }}
              />
            </ModalWrapper>
          </>
        )}
        {showReportCompleteModal && (
          <>
            <ModalWrapper>
              <AlertModal
                title="신고가 완료되었습니다"
                description="운영팀이 빠르게 확인해 조치하겠습니다"
                confirmText="확인"
                onConfirm={() => setShowReportCompleteModal(false)}
              />
            </ModalWrapper>
          </>
        )}
      </main>
    </>
  );
}
