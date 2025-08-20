"use client";

import { useState, useEffect, useCallback } from "react";

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
import type { RestaurantDetail } from "@/lib/types/restaurant";

import RestaurantDetailHeader from "./components/RestaurantDetailHeader";
import RestaurantImageCarousel from "./components/RestaurantImageCarousel";
import RestaurantInfoBox from "./components/RestaurantInfoBox";
import ReviewList from "./components/ReviewList/ReviewList";
import ReviewWriter from "./components/ReviewWriter/ReviewWriter";

// ✅ FoodCardList와 동일한 API 사용
import { likePlace, unlikePlace } from "@/mypage/api/favorites";

export default function RestaurantDetail() {
  const router = useRouter();
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
  const [heartBusy, setHeartBusy] = useState(false);

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
        // 1) 상세
        const restaurantData = await getRestaurantDetail(id);
        setRestaurants(restaurantData);
        setIsLiked(Boolean(restaurantData.zzim));

        // 2) 리뷰
        try {
          const reviewResult = await getReviews(id);
          setReviews(reviewResult.reviews);
          setReviewCount(reviewResult.allReviewCount);
          setAvgRating(reviewResult.avgRating);
          setMostTags(reviewResult.mostTags ?? []);
        } catch (reviewErr) {
          console.warn("리뷰 로딩 실패:", reviewErr);
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

  // ✅ FoodCardList 스타일: like / unlike를 분리하고, 낙관적 업데이트 후 실패 시 롤백
  const handleLike = useCallback(async () => {
    if (heartBusy || !restaurants) return;

    setHeartBusy(true);
    // 낙관적 업데이트
    setIsLiked(true);
    setRestaurants((prev) => (prev ? ({ ...prev, zzim: true } as any) : prev));

    try {
      await likePlace(restaurants.id);
    } catch (e) {
      console.error("찜 등록 실패:", e);
      // 롤백
      setIsLiked(false);
      setRestaurants((prev) =>
        prev ? ({ ...prev, zzim: false } as any) : prev,
      );
      alert("찜 등록 실패");
    } finally {
      setHeartBusy(false);
    }
  }, [heartBusy, restaurants]);

  const handleUnlike = useCallback(async () => {
    if (heartBusy || !restaurants) return;

    setHeartBusy(true);
    // 낙관적 업데이트
    setIsLiked(false);
    setRestaurants((prev) => (prev ? ({ ...prev, zzim: false } as any) : prev));

    try {
      await unlikePlace(restaurants.id);
    } catch (e) {
      console.error("찜 해제 실패:", e);
      // 롤백
      setIsLiked(true);
      setRestaurants((prev) =>
        prev ? ({ ...prev, zzim: true } as any) : prev,
      );
      alert("찜 해제 실패");
    } finally {
      setHeartBusy(false);
    }
  }, [heartBusy, restaurants]);

  // 서버에서 zzim 값이 바뀌어 다시 들어오면 동기화
  useEffect(() => {
    if (restaurants?.zzim !== undefined) {
      setIsLiked(Boolean(restaurants.zzim));
    }
  }, [restaurants?.zzim]);

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
      </main>
    );
  }

  if (!restaurants) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

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
          <button onClick={() => router.push("/restaurant")}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"back"}
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="relative flex min-h-[calc(100vh-10rem)] w-full flex-col items-center gap-3 overflow-y-auto px-4 pb-10">
        {/* 제목/하트/이미지 */}
        <section className="flex w-full flex-col items-center justify-between gap-2">
          <RestaurantDetailHeader
            name={restaurants.name}
            isLiked={isLiked}
            // ✅ FoodCardList 처럼 현재 상태에 따라 분기
            onLikeClick={isLiked ? handleUnlike : handleLike}
            // 필요 시 heartBusy 내려서 로딩 표시 가능
          />
          <RestaurantImageCarousel
            images={restaurants.reviewImages.map((img) => img.link)}
          />
        </section>

        {/* 정보 */}
        <section className="relative flex w-full flex-col items-center gap-3 rounded-md border-[1px] border-grey-darkHover bg-white p-4">
          <RestaurantInfoBox
            restaurant={{
              id: restaurants.id,
              name: restaurants.repreMenu?.[0]?.menu ?? "",
              googlePlaceId: restaurants.googlePlaceId,
              timetable: restaurants.currentOpeningHours,
              address: {
                road: restaurants.address,
                jibun: restaurants.addressJibeon,
                postalCode: restaurants.postalCode,
              },
            }}
            showAddress={showAddress}
            onToggleAddress={() => setShowAddress((prev) => !prev)}
          />
        </section>

        {/* 후기 작성 */}
        <ReviewWriter
          restaurantId={restaurants.id}
          restaurantName={restaurants.name}
        />

        {/* 후기/정렬/태그 */}
        <section className="flex w-full flex-col gap-2">
          <div className="flex justify-between px-2 py-2">
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
          </div>

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

          <div className="mt-5 flex w-full flex-col gap-3">
            <SortSelector
              options={sortOptions}
              selected={sortMode}
              onSelect={(value) => setSortMode(value as "recommend" | "latest")}
              className="-mb-2 mr-2"
            />

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
          <ModalWrapper>
            <ReportModal
              onClick={() => setShowReportModal(false)}
              onReport={() => {
                setShowReportCompleteModal(true);
                setShowReportModal(false);
              }}
            />
          </ModalWrapper>
        )}

        {showReportCompleteModal && (
          <ModalWrapper>
            <AlertModal
              title="신고가 완료되었습니다"
              description="운영팀이 빠르게 확인해 조치하겠습니다"
              confirmText="확인"
              onConfirm={() => setShowReportCompleteModal(false)}
            />
          </ModalWrapper>
        )}
      </main>
    </>
  );
}
