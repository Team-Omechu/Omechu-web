"use client";

import { useState, useEffect } from "react";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import ReportModal from "@/restaurant/restaurant-detail/[id]/components/ReportModal";
import { getRestaurantDetail } from "@/restaurant/api/restaurantList";
import { getReviews } from "@/restaurant/restaurant-detail/[id]/api/review";
import { MostTag } from "@/lib/types/review";
import { ReviewProps } from "@/lib/types/review";

import RestaurantDetailHeader from "./components/RestaurantDetailHeader";
import RestaurantImageCarousel from "./components/RestaurantImageCarousel";
import RestaurantInfoBox from "./components/RestaurantInfoBox";
import ReviewList from "./components/ReviewList/ReviewList";
import ReviewWriter from "./components/ReviewWriter/ReviewWriter";
import type { RestaurantDetail } from "@/lib/types/restaurant";

export default function RestaurantDetail() {
  const router = useRouter(); // 페이지 이동을 위한 라우터 훅
  const params = useParams();
  const id = Number(params?.id);

  const [restaurants, setRestaurants] = useState<RestaurantDetail | null>(null);
  const [showAddress, setShowAddress] = useState(false);
  const [activeOptionId, setActiveOptionId] = useState<number | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);
  const [votedReviewIds, setVotedReviewIds] = useState<number[]>([]);
  const [localVotes, setLocalVotes] = useState<Record<number, number>>({});
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mostTags, setMostTags] = useState<MostTag[]>([]);

  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최신 순", value: "latest" },
  ];
  type SortValue = SortOption["value"];
  const [sortMode, setSortMode] = useState<SortValue>("recommend");

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    async function fetchData() {
      try {
        // 1. 맛집 상세 정보는 무조건 먼저 가져옴
        const restaurantData = await getRestaurantDetail(id);
        setRestaurants(restaurantData);

        setIsLiked(restaurantData.zzim ?? false);

        // 2. 리뷰 정보는 실패 가능성이 있으므로 별도 처리
        try {
          const reviewResult = await getReviews(id);
          setReviews(reviewResult.reviews);
          setReviewCount(reviewResult.allReviewCount);
          setAvgRating(reviewResult.avgRating);
          setMostTags(reviewResult.mostTags ?? []);
        } catch (reviewErr) {
          console.warn("리뷰 로딩 실패:", reviewErr);

          // FAIL(C004: 리뷰 없음)일 수 있으므로 기본값 설정
          setReviews([]);
          setReviewCount(0);
          setAvgRating(0);
          setMostTags([]);
        }
      } catch (e) {
        console.error("맛집 정보 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </main>
    );
  }

  console.log("맛집 상세 정보:", restaurants);
  if (!restaurants) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  // 정렬된 후기 리스트 계산 (정렬 기준에 따라 다르게 정렬됨)
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortMode === "recommend") {
      const aVotes = localVotes[a.id] ?? a.votes;
      const bVotes = localVotes[b.id] ?? b.votes;
      return bVotes - aVotes;
    } else {
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
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
            name={restaurants.name}
            isLiked={isLiked}
            onLikeClick={handleLikeClick}
          />
          <RestaurantImageCarousel
            images={restaurants.reviewImages.map((img) => img.link)}
          />
        </section>
        {/* 맛집 정보 */}
        <section className="relative flex w-full flex-col items-center gap-3 rounded-md border-[1px] border-grey-darkHover bg-white p-4">
          {/* 정보 - 메뉴 종류 */}
          <RestaurantInfoBox
            restaurant={{
              id: restaurants.id,
              name: restaurants.name,
              googlePlaceId: restaurants.googlePlaceId,
              timetable: restaurants.currentOpeningHours,
              address: {
                road: restaurants.address, // 주소 전체를 도로명처럼 처리
                jibun: restaurants.addressJibeon, // 현재 API에는 따로 없음
                postalCode: restaurants.postalCode, // 우편번호도 없음
              },
            }}
            showAddress={showAddress}
            onToggleAddress={() => setShowAddress((prev) => !prev)}
          />
        </section>

        {/* 후기 작성 칸 */}
        <ReviewWriter
          restaurantId={restaurants.id}
          restaurantName={restaurants.name}
        />

        {/* 후기 */}
        <section className="flex w-full flex-col gap-2">
          <div className="flex justify-between px-2 py-2">
            {/* 후기 평점 - 후기 개수 */}
            {restaurants && (
              <div className="flex w-full justify-between px-2 py-2">
                <div className="flex gap-2 text-xl font-medium text-[#1F9BDA]">
                  <span>{avgRating.toFixed(1)}</span>
                  <span>
                    {"★".repeat(Math.round(restaurants.rating)) +
                      "☆".repeat(5 - Math.round(restaurants.rating))}
                  </span>
                </div>
                <div className="flex gap-1 text-base font-medium text-[#828282]">
                  <span>후기</span>
                  <span className="font-bold">{reviewCount}</span>
                  <span>건</span>
                </div>
              </div>
            )}
          </div>

          {/* 후기 관련 태그 */}
          <div className="flex flex-wrap justify-center gap-1 px-4">
            {mostTags.map((item, index) => (
              <div
                key={index}
                className="mt-1 w-fit rounded-3xl border-[1px] border-grey-darkHover bg-white px-4 py-1 text-sm font-normal duration-300 hover:scale-105"
              >
                {item.tag}
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
              restId={restaurants.id}
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
