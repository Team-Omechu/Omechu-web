"use client";
// 라이브러리
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter(); // 페이지 이동을 위한 라우터 훅

  const params = useParams();
  const id = Number((params as { id: string }).id);

  // 상세주소 토글 여부를 저장하는 상태값
  const [showAddress, setShowAddress] = useState(false);

  // 사용자가 클릭한 별점 저장 (후기 작성용)
  const [rating, setRating] = useState(0); // 0~5점

  // 현재 옵션 메뉴가 열려있는 후기의 ID (없으면 null)
  const [activeOptionId, setActiveOptionId] = useState<number | null>(null);
  // 신고 모달 상태값
  const [showReportModal, setShowReportModal] = useState(false);

  // 신고 완료 모달 상태값
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);

  // 사용자가 추천(좋아요) 버튼을 누른 후기 ID 목록
  const [votedReviewIds, setVotedReviewIds] = useState<number[]>([]);

  // 로컬 상태에서 추천 수를 따로 관리하는 객체 (key: 리뷰 id, value: 추천 수)
  const [localVotes, setLocalVotes] = useState<Record<number, number>>({});

  // 후기 정렬 기준 상태값 (기본: 추천순)
  const [sortType, setSortType] = useState<"recommend" | "latest">("recommend");

  // id에 해당하는 맛집 정보 찾기
  const restaurant = restaurantList.find((item) => item.id === id);

  if (!restaurant) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  // 해당 맛집의 후기(review)만 필터링
  const filteredReviews = sampleReviews.filter(
    (review) => review.restaurantId === restaurant.id
  );

  // 해당 맛집의 평점 요약 정보 가져오기 (없으면 id 0을 fallback으로 사용)
  const summary = reviewSummary[restaurant.id];

  // 날짜 문자열(2025.05.05)을 Date 객체로 변환하는 함수
  const parseDate = (dateStr: string) => new Date(dateStr.replace(/\./g, "-"));

  // 정렬된 후기 리스트 계산 (정렬 기준에 따라 다르게 정렬됨)
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortType === "recommend") {
      // 추천순: localVotes가 있으면 우선 적용, 없으면 기본 votes 사용
      const aVotes = localVotes[a.id] ?? a.votes;
      const bVotes = localVotes[b.id] ?? b.votes;
      return bVotes - aVotes; // 내림차순 정렬 (추천 수 많은 게 앞으로)
    } else {
      // 최신순: 날짜를 비교하여 최근 날짜가 먼저 오도록 정렬
      return (
        parseDate(b.createdDate).getTime() - parseDate(a.createdDate).getTime()
      );
    }
  });

  return (
    <>
      <Header
        title={""}
        className="border-none"
        leftChild={
          <button
            onClick={() => {
              router.push("/restaurant");
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
            {restaurant.name}
          </h1>
          <div className="flex w-full gap-3 px-4 py-2 overflow-x-auto">
            {restaurant.images.map((url, idx) => (
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
              {restaurant.category}
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
              {restaurant.timetable.map((item, index) => (
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
                  {restaurant.address.road}
                </span>
              </div>
              {showAddress && (
                <>
                  <div className="flex items-start gap-1">
                    <span className="text-sm font-bold text-[#393939] w-14 flex-shrink-0 ">
                      지번
                    </span>
                    <span className="text-sm  font-normal text-[#828282] whitespace-pre-wrap">
                      {restaurant.address.jibun}
                    </span>
                  </div>

                  <div className="flex items-start gap-1">
                    <span className="text-sm font-normal text-[#828282] whitespace-pre-wrap">
                      우편번호
                    </span>
                    <span className="text-sm font-normal text-[#828282] whitespace-pre-wrap">
                      {restaurant.address.postalCode}
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
                router.push(`/restaurant-detail/${restaurant.id}/map`)
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
              <div className="flex justify-between w-full px-2 py-2">
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
            {(reviewTags[restaurant.id] || []).map((item, index) => (
              <div
                key={index}
                className="mt-1 px-4 py-1 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-normal hover:scale-105 duration-300"
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
