/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";

import AlertModal from "@/components/common/AlertModal";
import Header from "@/components/common/Header";
import ModalWrapper from "@/components/common/ModalWrapper";
import SortSelector, { SortOption } from "@/components/common/SortSelector";
import ReportModal from "@/restaurant/restaurant-detail/[id]/components/ReportModal";
import { getRestaurantDetail } from "@/restaurant/api/restaurantList";
import { getReviewsPage } from "@/restaurant/restaurant-detail/[id]/api/review";
import type { ReviewProps, MostTag } from "@/lib/types/review";
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

  const [isLiked, setIsLiked] = useState(false);
  const [heartBusy, setHeartBusy] = useState(false);

  const [loading, setLoading] = useState(true);

  const sortOptions: SortOption[] = [
    { label: "추천 순", value: "recommend" },
    { label: "최신 순", value: "latest" },
  ];
  type SortValue = SortOption["value"];
  const [sortMode, setSortMode] = useState<SortValue>("recommend");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    async function fetchData() {
      try {
        const restaurantData = await getRestaurantDetail(id);
        setRestaurants(restaurantData);
        setIsLiked(Boolean(restaurantData.zzim));
      } catch (e) {
        console.error("맛집 정보 로딩 실패:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["reviews", id],
      queryFn: ({ pageParam = 0 }) => getReviewsPage(id, pageParam, 8),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: 0,
      enabled: !!id,
    });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }, // 절반 보이면 트리거
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const firstPage = data?.pages[0];
  const reviewCount = firstPage?.allReviewCount ?? 0;
  const avgRating = firstPage?.avgRating ?? 0;
  const mostTag: MostTag[] = firstPage?.mostTag ?? [];

  const rawReviews: ReviewProps[] =
    data?.pages.flatMap((page) => page.reviews) ?? [];

  const reviews: ReviewProps[] = [...rawReviews].sort((a, b) => {
    if (sortMode === "latest") {
      // createdDate 기준 최신순
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    }
    if (sortMode === "recommend") {
      // 좋아요(votes) 기준 내림차순
      return (b.votes ?? 0) - (a.votes ?? 0);
    }
    return 0;
  });

  const handleLike = useCallback(async () => {
    if (heartBusy || !restaurants) return;
    setHeartBusy(true);
    setIsLiked(true);
    setRestaurants((prev) => (prev ? { ...prev, zzim: true } : prev));
    try {
      await likePlace(restaurants.id);
    } catch (e) {
      setIsLiked(false);
      setRestaurants((prev) => (prev ? { ...prev, zzim: false } : prev));
      alert("찜 등록 실패");
    } finally {
      setHeartBusy(false);
    }
  }, [heartBusy, restaurants]);

  const handleUnlike = useCallback(async () => {
    if (heartBusy || !restaurants) return;
    setHeartBusy(true);
    setIsLiked(false);
    setRestaurants((prev) => (prev ? { ...prev, zzim: false } : prev));
    try {
      await unlikePlace(restaurants.id);
    } catch (e) {
      setIsLiked(true);
      setRestaurants((prev) => (prev ? { ...prev, zzim: true } : prev));
      alert("찜 해제 실패");
    } finally {
      setHeartBusy(false);
    }
  }, [heartBusy, restaurants]);

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

  return (
    <>
      <Header
        title=""
        className="border-none"
        leftChild={
          <button onClick={() => router.push("/restaurant")}>
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt="back"
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
            onLikeClick={isLiked ? handleUnlike : handleLike}
          />
          <RestaurantImageCarousel
            images={restaurants.reviewImages.map((img) => img.link)}
          />
        </section>

        {/* 정보 */}
        <section className="relative flex w-full flex-col items-center gap-3 rounded-md border bg-white p-4">
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
                  {"★".repeat(Math.round(avgRating)) +
                    "☆".repeat(5 - Math.round(avgRating))}
                </span>
              </div>
              <div className="flex gap-1 text-base font-medium text-[#828282]">
                <span>후기</span>
                <span className="font-bold">{reviewCount}</span>
                <span>건</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 px-4">
            {mostTag.map((item, index) => (
              <div
                key={index}
                className="flex items-center rounded-3xl border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700"
              >
                <span>{item.tag}</span>
                <span className="ml-1 text-gray-500">({item.count})</span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex w-full flex-col gap-3">
            <SortSelector
              options={sortOptions}
              selected={sortMode}
              onSelect={(value) => setSortMode(value as SortValue)}
              className="-mb-2 mr-2"
            />

            <ReviewList
              restId={restaurants.id}
              reviews={reviews}
              localVotes={localVotes}
              votedReviewIds={votedReviewIds}
              setVotedReviewIds={setVotedReviewIds}
              setLocalVotes={setLocalVotes}
              activeOptionId={activeOptionId}
              setActiveOptionId={setActiveOptionId}
              onReport={() => setShowReportModal(true)}
            />

            {/* 무한스크롤 로딩 */}
            {hasNextPage && (
              <div
                ref={loadMoreRef}
                className="mx-auto mt-4 h-10 w-full text-center text-gray-400"
              >
                {isFetchingNextPage ? "불러오는 중..." : "스크롤하여 더 보기"}
              </div>
            )}
          </div>
        </section>

        {/* 신고 모달 */}
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
