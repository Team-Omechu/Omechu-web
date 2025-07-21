"use client";

import { useState } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import { Restaurants } from "@/constant/restaurant/restaurantList";
import { reviewSummary, reviewTags } from "@/constant/restaurant/reviewSummary";
import { sampleReviews } from "@/constant/restaurant/sampleReviews";
import ReportModal from "@/restaurant/restaurant-detail/[id]/components/ReportModal";

import RestaurantDetailHeader from "./components/RestaurantDetailHeader";
import RestaurantImageCarousel from "./components/RestaurantImageCarousel";
import RestaurantInfoBox from "./components/RestaurantInfoBox";
import ReviewList from "./components/ReviewList/ReviewList";
import ReviewWriter from "./components/ReviewWriter/ReviewWriter";

export default function RestaurantDetail() {
  const router = useRouter(); // 페이지 이동을 위한 라우터 훅

  const params = useParams();
  const id = Number((params as { id: string }).id);

  // 상세주소 토글 여부를 저장하는 상태값
  const [showAddress, setShowAddress] = useState(false);

  // 사용자가 클릭한 별점 저장 (후기 작성용)
  // const [rating, setRating] = useState(0); // 0~5점

  // 후기 작성 모달 열림 여부
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  // 후기 정렬 옵션
  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최신 순", value: "latest" },
  ];

  // 후기 정렬 기준 상태값 (기본: 추천순)
  type SortValue = SortOption["value"];
  const [sortMode, setSortMode] = useState<SortValue>("recommend");

  // 좋아요 상태 관리 (임시로 하트 클릭 시 토글)
  const [isLiked, setIsLiked] = useState(false);

  // 하트 클릭 시 좋아요 상태 토글
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  // id에 해당하는 맛집 정보 찾기
  const restaurant = Restaurants.find((item) => item.id === id);

  if (!restaurant) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  // 해당 맛집의 후기(review)만 필터링
  const filteredReviews = sampleReviews.filter(
    (review) => review.restaurantId === restaurant.id,
  );

  // 해당 맛집의 평점 요약 정보 가져오기 (없으면 id 0을 fallback으로 사용)
  const summary = reviewSummary[restaurant.id];

  // 날짜 문자열(2025.05.05)을 Date 객체로 변환하는 함수
  const parseDate = (dateStr: string) => new Date(dateStr.replace(/\./g, "-"));

  // 정렬된 후기 리스트 계산 (정렬 기준에 따라 다르게 정렬됨)
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortMode === "recommend") {
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
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      {/* 메인 Container*/}
      <main className="relative flex min-h-[calc(100vh-10rem)] w-full flex-col items-center gap-3 overflow-y-auto px-4 pb-10">
        {/* 맛집 제목, 사진 */}
        <section className="flex w-full flex-col items-center justify-between gap-2">
          <RestaurantDetailHeader
            name={restaurant.name}
            isLiked={isLiked}
            onLikeClick={handleLikeClick}
          />
          <RestaurantImageCarousel images={restaurant.images} />
        </section>
        {/* 맛집 정보 */}
        <section className="relative flex w-full flex-col items-center gap-3 rounded-md border-[1px] border-[#393939] bg-white p-4">
          {/* 정보 - 메뉴 종류 */}
          <RestaurantInfoBox
            restaurant={restaurant}
            showAddress={showAddress}
            onToggleAddress={() => setShowAddress((prev) => !prev)}
          />
        </section>

        {/* 후기 작성 칸 */}
        <ReviewWriter restaurantName={restaurant.name} />

        {/* 후기 */}
        <section className="flex w-full flex-col gap-2">
          <div className="flex justify-between px-2 py-2">
            {/* 후기 평점 - 후기 개수 */}
            {summary && (
              <div className="flex w-full justify-between px-2 py-2">
                <div className="flex gap-2 text-xl font-medium text-[#1F9BDA]">
                  <span>{summary.averageRating.toFixed(1)}</span>
                  <span>
                    {"★".repeat(Math.round(summary.averageRating)) +
                      "☆".repeat(5 - Math.round(summary.averageRating))}
                  </span>
                </div>
                <div className="flex gap-1 text-base font-medium text-[#828282]">
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
                className="mt-1 w-fit rounded-3xl border-[1px] border-[#393939] bg-white px-4 py-1 text-sm font-normal duration-300 hover:scale-105"
              >
                {item}
              </div>
            ))}
          </div>

          {/* 후기 카드 목록 */}
          <div className="mt-5 flex w-full flex-col gap-3">
            {/* 후기 필터 버튼 */}
            <SortSelector
              options={sortOptions}
              selected={sortMode}
              onSelect={(value) => setSortMode(value as "recommend" | "latest")}
              className="-mb-2 mr-2"
            />

            {/* 후기 목록 */}
            <ReviewList
              reviews={sortedReviews}
              localVotes={localVotes}
              votedReviewIds={votedReviewIds}
              setVotedReviewIds={setVotedReviewIds}
              setLocalVotes={setLocalVotes}
              activeOptionId={activeOptionId}
              setActiveOptionId={setActiveOptionId}
              onReport={() => setShowReportModal(true)}
            />
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
