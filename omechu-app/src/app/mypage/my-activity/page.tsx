/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Header from "@/components/common/Header";
import SelectTabBar from "@/components/mypage/SelectTabBar";
import SortSelector from "@/components/common/SortSelector";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import FoodCard from "@/components/common/FoodCard";
import FoodReviewCard from "@/components/common/RestaurantReviewCard";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import SkeletonRestaurantReviewCard from "@/components/common/SkeletonRestaurantReviewCard";
import { LoadingSpinner } from "@/components/common/LoadingIndicator";

import AuthErrorModal from "../AuthErrorModalSection";
import { useAuthStore } from "@/auth/store";

import {
  fetchMyPlaces,
  fetchMyReviews,
  toggleReviewLike,
  type MyReviewItem,
} from "../api/myActivity";
import { likePlace, unlikePlace } from "../api/favorites";
import Toast from "@/components/common/Toast";

/*            타입/상수           */
type MyRestaurant = {
  id: number;
  name: string;
  repre_menu?: string;
  rating?: number;
  images?: { link: string }[];
  address?: string;
  reviews?: number;
  isLiked?: boolean;
};

const ITEMS_PER_PAGE = 5;
const IO_ROOT_MARGIN = "0px 0px 160px 0px"; // 하단 BottomNav 고려
const IO_THRESHOLD = 0;
const LOADING_DELAY_MS = 1800;

/*            유틸리티            */
// ISO 문자열 → 'YYYY.MM.DD HH:mm' (로컬 타임존)
const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${y}.${m}.${day} ${hh}:${mm}`;
};

/*          컴포넌트 본문         */
export default function MyActivity() {
  const router = useRouter();

  // 인증/하이드레이션
  const user = useAuthStore((s) => s.user);
  const accessToken = user?.accessToken;
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  // 공통 UI 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 서버 패칭 로딩
  const [listLoading, setListLoading] = useState(false); // 무한 스크롤 로딩
  const [error, setError] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 탭/리스트 상태
  const [selectedIndex, setSelectedIndex] = useState(0); // 0: 후기 / 1: 등록한 맛집
  const [sortOrder, setSortOrder] = useState<"recommended" | "latest">(
    "recommended",
  );
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // 데이터
  const [reviewList, setReviewList] = useState<MyReviewItem[]>([]);
  const [myRestaurants, setMyRestaurants] = useState<MyRestaurant[]>([]);

  // 토스트
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  /*        데이터 패칭(후기)       */
  useEffect(() => {
    if (!hasHydrated || selectedIndex !== 0) return;
    if (!accessToken) {
      // 깜빡임 방지: 모달은 여기서 열지 않음. 패칭만 중단.
      setReviewList([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMyReviews()
      .then((res: any) => {
        const list = res.success?.data;
        if (!Array.isArray(list)) {
          setReviewList([]);
          setError("리뷰 데이터를 불러오지 못했습니다.");
          return;
        }
        const normalized = list.map((r: any) => ({
          ...r,
          isLiked: Boolean(r.isLiked ?? (r.like > 0 ? false : false)),
        }));
        setReviewList(normalized);
        setModalOpen(false);
      })
      .catch((e: any) => {
        if (e?.response?.status === 401) setModalOpen(true);
        setError("리뷰 불러오기 실패");
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken, selectedIndex]);

  /*     데이터 패칭(등록한 맛집)    */
  useEffect(() => {
    if (!hasHydrated || selectedIndex !== 1) return;
    if (!accessToken) {
      setMyRestaurants([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchMyPlaces(10, 10)
      .then((data: any) => {
        const places = data.success?.data ?? [];
        const mapped: MyRestaurant[] = places.map((item: any) => ({
          id: Number(item.id),
          name: item.name || "-",
          repre_menu:
            Array.isArray(item.repre_menu) && item.repre_menu.length > 0
              ? (item.repre_menu[0]?.menu ?? "")
              : "",
          rating: item.rating ?? 0,
          images: item.rest_image ? [{ link: item.rest_image }] : [],
          address: item.address ?? "",
          reviews: item._count?.review ?? 0,
        }));
        setMyRestaurants(mapped);
        setModalOpen(false);
      })
      .catch((err: any) => {
        if (err?.response?.status === 401) setModalOpen(true);
        setError("맛집 목록을 불러오지 못했습니다.");
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken, selectedIndex]);

  /*        무한 스크롤 설정        */
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting || listLoading) return;

      setListLoading(true);
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    },
    [listLoading],
  );

  useEffect(() => {
    // 현재 탭 리스트 길이보다 더 보여주려고 할 경우만 관찰
    const total =
      selectedIndex === 0
        ? reviewList.length
        : selectedIndex === 1
          ? myRestaurants.length
          : 0;
    if (visibleCount >= total) return;

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: IO_ROOT_MARGIN,
      threshold: IO_THRESHOLD,
    });

    const node = loaderRef.current;
    if (node) observer.observe(node);

    return () => observer.disconnect();
  }, [
    observerCallback,
    selectedIndex,
    visibleCount,
    reviewList.length,
    myRestaurants.length,
  ]);

  // 로딩 딜레이 종료
  useEffect(() => {
    if (!listLoading) return;
    const t = setTimeout(() => setListLoading(false), LOADING_DELAY_MS);
    return () => clearTimeout(t);
  }, [listLoading]);

  // 탭 전환 시 목록 개수 초기화
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedIndex]);

  /*           파생 값 메모         */
  const sortedReviews = useMemo(() => {
    if (sortOrder === "latest") {
      return [...reviewList].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
    return [...reviewList].sort((a, b) => (b.like ?? 0) - (a.like ?? 0));
  }, [reviewList, sortOrder]);

  const visibleReviews = useMemo(
    () => sortedReviews.slice(0, visibleCount),
    [sortedReviews, visibleCount],
  );

  const visiblePlaces = useMemo(
    () => myRestaurants.slice(0, visibleCount),
    [myRestaurants, visibleCount],
  );

  /*            이벤트 핸들러        */
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLikeToggle = async (
    restId: number,
    reviewId: number,
    currentLiked: boolean,
  ) => {
    // 1) 낙관적 업데이트
    setReviewList((prev) =>
      prev.map((r) =>
        Number(r.id) !== reviewId
          ? r
          : {
              ...r,
              isLiked: !currentLiked,
              like: Math.max(0, (r.like ?? 0) + (currentLiked ? -1 : 1)),
            },
      ),
    );

    try {
      // 2) 서버 반영
      await toggleReviewLike(restId, reviewId, !currentLiked);
    } catch (e) {
      // 3) 실패 시 롤백
      setReviewList((prev) =>
        prev.map((r) =>
          Number(r.id) !== reviewId
            ? r
            : {
                ...r,
                isLiked: currentLiked,
                like: Math.max(0, (r.like ?? 0) + (currentLiked ? 1 : -1)),
              },
        ),
      );
      console.error(e);
      setToastMessage("좋아요 변경에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handleDeleteReview = (id: number) => {
    // TODO: 리뷰 삭제 기능
  };

  const handleNavigateToRestaurant = (restaurantId?: string | number) => {
    if (restaurantId)
      router.push(`/restaurant/restaurant-detail/${restaurantId}`);
  };

  /*              렌더링            */
  return (
    <>
      <Header
        title="활동 내역"
        leftChild={
          <Link href="/mypage">
            <img
              src="/arrow/left-header-arrow.svg"
              alt="back"
              width={22}
              height={22}
            />
          </Link>
        }
      />

      <SelectTabBar
        tabs={["후기", "등록한 맛집"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      <main
        ref={mainRef}
        className="flex h-screen w-full flex-col items-center overflow-y-auto px-2 pb-8 pt-3 scrollbar-hide"
      >
        {/* 후기 탭 */}
        {selectedIndex === 0 && (
          <>
            <section className="flex w-full justify-end gap-1 pb-3 pr-5 pt-1 text-sm text-grey-normalActive">
              <SortSelector
                options={[
                  { label: "추천 순", value: "recommended" },
                  { label: "최신 순", value: "latest" },
                ]}
                selected={sortOrder}
                onSelect={(v) =>
                  setSortOrder(v === "latest" ? "latest" : "recommended")
                }
              />
            </section>

            {loading ? (
              <div className="flex flex-col gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonRestaurantReviewCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <section className="flex w-full flex-col items-center gap-7">
                {reviewList.length === 0 ? (
                  <div className="flex w-full items-center justify-center py-10 text-grey-normalActive">
                    작성한 후기가 없습니다.
                  </div>
                ) : (
                  <>
                    {visibleReviews.map((review) => (
                      <FoodReviewCard
                        key={review.id}
                        id={Number(review.id)}
                        createdAt={formatDate(review.created_at)}
                        restaurantName={review.restaurant?.name ?? "-"}
                        rating={review.rating ?? 0}
                        reviewText={review.text ?? ""}
                        recommendCount={review.like ?? 0}
                        isLiked={Boolean(review.like)}
                        onLikeToggle={() =>
                          handleLikeToggle(
                            Number(review.restaurant?.id),
                            Number(review.id),
                            Boolean(review.like),
                          )
                        }
                        restaurantImage={review.restaurant?.rest_image ?? ""}
                        reviewImages={
                          Array.isArray(review.reviewImages)
                            ? review.reviewImages
                            : []
                        }
                        tags={Array.isArray(review.tag) ? review.tag : []}
                        onDelete={() => handleDeleteReview(Number(review.id))}
                        onNavigate={() =>
                          handleNavigateToRestaurant(
                            String(review.restaurant?.id),
                          )
                        }
                      />
                    ))}
                    {reviewList.length > visibleCount && (
                      <div ref={loaderRef} className="h-[1px]" />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        {/* 등록한 맛집 탭 */}
        {selectedIndex === 1 && (
          <>
            {loading ? (
              <div className="flex w-full flex-col items-center gap-7 pt-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonFoodCard key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <section className="flex w-full flex-col gap-5 px-2">
                {myRestaurants.length === 0 ? (
                  <div className="flex w-full items-center justify-center py-10 text-grey-normalActive">
                    등록한 맛집이 없습니다.
                  </div>
                ) : (
                  <>
                    {visiblePlaces.map((item) => (
                      <div key={item.id} className="flex w-full flex-col">
                        <span className="w-full pr-2 text-end text-xs text-grey-normalActive">
                          편집
                        </span>
                        <FoodCard
                          onLike={async () => {
                            await likePlace(item.id);
                            setMyRestaurants((prev) =>
                              prev.map((r) =>
                                r.id === item.id ? { ...r, isLiked: true } : r,
                              ),
                            );
                          }}
                          onUnlike={async () => {
                            await unlikePlace(item.id);
                            setMyRestaurants((prev) =>
                              prev.map((r) =>
                                r.id === item.id ? { ...r, isLiked: false } : r,
                              ),
                            );
                          }}
                          item={{
                            id: item.id,
                            name: item.name,
                            menu: item.repre_menu || "",
                            rating: item.rating || 0,
                            images: item.images
                              ? item.images.map((img) => img.link ?? "")
                              : [],
                            address: {
                              road: item.address || "",
                              jibun: "",
                              postalCode: "",
                            },
                            tags: [],
                            isLiked: item.isLiked,
                            reviews: 0,
                            category: "",
                            timetable: [],
                          }}
                          onClick={() =>
                            router.push(
                              `/restaurant/restaurant-detail/${item.id}`,
                            )
                          }
                        />
                      </div>
                    ))}
                    {myRestaurants.length > visibleCount && (
                      <div ref={loaderRef} className="h-[1px]" />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />

        {/* 좋아요 오류 - 토스트 */}
        {showToast && (
          <Toast message={toastMessage} show={showToast} className="w-full" />
        )}
      </main>

      {/* 인증 모달: 하이드레이션 이후에만 판단 */}
      {hasHydrated && modalOpen && (
        <AuthErrorModal
          onConfirm={() => {
            setModalOpen(false);
            router.push("/sign-in");
          }}
          onClose={() => {
            setModalOpen(false);
            router.push("/sign-in");
          }}
        />
      )}
    </>
  );
}
