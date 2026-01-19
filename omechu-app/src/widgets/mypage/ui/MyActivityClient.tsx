/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Header, SortSelector, FloatingActionButton } from "@/shared";
// TODO: 아래 컴포넌트들은 shared에 없음 - 추가 필요
import SelectTabBar from "@/components/mypage/SelectTabBar";
import FoodCard from "@/components/common/FoodCard";
import FoodReviewCard from "@/components/common/RestaurantReviewCard";
import SkeletonFoodCard from "@/components/common/SkeletonFoodCard";
import SkeletonRestaurantReviewCard from "@/components/common/SkeletonRestaurantReviewCard";

import { useAuthStore } from "@/entities/user/model/auth.store";

import RestaurantEditModal from "@/restaurant/components/RestaurantAddModal/RestaurantEditModal";
import {
  updateRestaurant,
  type UpdateRestaurantPayload,
} from "@/mypage/api/updateRestaurant";

import {
  fetchMyPlaces,
  fetchMyReviews,
  toggleReviewLike,
  deleteMyReview,
  type MyReviewItem,
} from "@/mypage/api/myActivity";

import Toast from "@/components/common/Toast";
import {
  fetchHeartList,
  likePlace,
  unlikePlace,
} from "@/entities/mypage/api/favorites";
import AuthErrorModalSection from "@/entities/mypage/ui/AuthErrorModalSection";

/* ---------- 타입/상수 ---------- */
type MyRestaurant = {
  id: number;
  name: string;
  repre_menu?: string;
  rating?: number;
  images?: { link: string }[];
  address?: string;
  reviews?: number;
  isLiked?: boolean;
  like?: boolean; // ✅ FoodCard가 초기/동기화에 참조하는 필드
};
const ITEMS_PER_PAGE = 5;
const IO_ROOT_MARGIN = "0px 0px 160px 0px";
const IO_THRESHOLD = 0;
const LOADING_DELAY_MS = 1800;
const PLACES_PAGE_SIZE = 1000; // 등록한 맛집 페이지네이션 단위

/* ---------- 유틸 ---------- */
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

/* ---------- 본문 ---------- */
export default function MyActivityClient() {
  const router = useRouter();

  // 인증/하이드레이션
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;
  const isAuthenticated = Boolean(accessToken && refreshToken);

  // 공통 UI 상태
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
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
  const [placesOffset, setPlacesOffset] = useState(0);
  const [hasMorePlaces, setHasMorePlaces] = useState(true);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);

  // 토스트
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [likePending, setLikePending] = useState<Set<number>>(new Set());
  const [deletePending, setDeletePending] = useState<Set<number>>(new Set());
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<MyRestaurant | null>(null);
  const [lastHeartClickAt, setLastHeartClickAt] = useState(0);

  /* 후기 패칭 */
  useEffect(() => {
    if (!hasHydrated || selectedIndex !== 0) return;
    if (!accessToken) {
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
          isLiked: Boolean(
            r.isLiked ??
            r.is_liked ??
            r.myLike ??
            r.my_like ??
            r.liked ??
            r.userLiked ??
            (typeof r.like === "number" ? r.like > 0 : false),
          ),
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

  /* 등록한 맛집 패칭 */
  useEffect(() => {
    if (!hasHydrated || selectedIndex !== 1) return;
    if (!accessToken) {
      setMyRestaurants([]);
      return;
    }
    setLoading(true);
    setError(null);

    // 첫 페이지 로드
    setPlacesOffset(0);
    setHasMorePlaces(true);
    setFetchingPlaces(true);
    fetchMyPlaces(PLACES_PAGE_SIZE, 0)
      .then((data: any) => {
        const places = data.success?.data ?? [];
        const mapped: MyRestaurant[] = places.map((item: any) => {
          const serverLiked = Boolean(
            item.isLiked ??
            item.is_liked ??
            item.isHearted ??
            item.hearted ??
            item.my_heart ??
            item.myHeart ??
            item.favorited ??
            item.is_favorite,
          );
          return {
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
            isLiked: serverLiked,
            like: serverLiked,
          };
        });
        // 최신이 위로 오도록 페이지 단위 역순 정렬(서버 정렬 불명 시 안전)
        const firstBatch = mapped.slice().reverse();
        setMyRestaurants(firstBatch);
        setVisibleCount(firstBatch.length); // 현재까지 로드한 만큼 표시
        setHasMorePlaces(places.length === PLACES_PAGE_SIZE);
        setPlacesOffset(PLACES_PAGE_SIZE);
        setModalOpen(false);
      })
      .catch((err: any) => {
        if (err?.response?.status === 401) setModalOpen(true);
        setError("맛집 목록을 불러오지 못했습니다.");
      })
      .finally(() => {
        setFetchingPlaces(false);
        setLoading(false);
      });
  }, [hasHydrated, accessToken, selectedIndex]);

  // 등록한 맛집 재조회 (편집/찜 변경 등 후 싱크용)
  const reloadMyPlaces = useCallback(async () => {
    try {
      const data: any = await fetchMyPlaces(PLACES_PAGE_SIZE, 0);
      const places = data.success?.data ?? [];
      const mapped: MyRestaurant[] = places.map((item: any) => {
        const serverLiked = Boolean(
          item.isLiked ??
          item.is_liked ??
          item.isHearted ??
          item.hearted ??
          item.my_heart ??
          item.myHeart ??
          item.favorited ??
          item.is_favorite,
        );
        return {
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
          isLiked: serverLiked,
          like: serverLiked,
        };
      });
      // 첫 페이지로 리셋
      setPlacesOffset(PLACES_PAGE_SIZE);
      const firstBatch = mapped.slice().reverse();
      setMyRestaurants(firstBatch);
      setVisibleCount(firstBatch.length);
      setHasMorePlaces(mapped.length >= PLACES_PAGE_SIZE);
    } catch (err) {
      console.error("[reloadMyPlaces] 실패:", err);
    }
  }, []);

  // 다음 페이지 로더
  const loadMorePlaces = useCallback(async () => {
    if (fetchingPlaces || !hasMorePlaces || !accessToken) return;
    setFetchingPlaces(true);
    try {
      const data: any = await fetchMyPlaces(PLACES_PAGE_SIZE, placesOffset);
      const places = data.success?.data ?? [];
      const mapped: MyRestaurant[] = places.map((item: any) => {
        const serverLiked = Boolean(
          item.isLiked ??
          item.is_liked ??
          item.isHearted ??
          item.hearted ??
          item.my_heart ??
          item.myHeart ??
          item.favorited ??
          item.is_favorite,
        );
        return {
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
          isLiked: serverLiked,
          like: serverLiked,
        };
      });
      const batch = mapped.slice().reverse();
      setMyRestaurants((prev) => [...prev, ...batch]);
      setVisibleCount((prev) => prev + batch.length);
      setHasMorePlaces(places.length === PLACES_PAGE_SIZE);
      setPlacesOffset((prev) => prev + PLACES_PAGE_SIZE);
    } catch (err) {
      console.error("[loadMorePlaces] 실패:", err);
    } finally {
      setFetchingPlaces(false);
    }
  }, [fetchingPlaces, hasMorePlaces, accessToken, placesOffset]);

  /* 무한 스크롤 */
  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting) return;

      if (selectedIndex === 0) {
        if (listLoading) return;
        setListLoading(true);
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        return;
      }
      // 등록한 맛집 탭(1): 다음 페이지 로드
      if (selectedIndex === 1) {
        loadMorePlaces();
        return;
      }
    },
    [listLoading, selectedIndex, loadMorePlaces],
  );

  useEffect(() => {
    // 리뷰 탭: 기존 visibleCount 기반, 등록 탭: hasMorePlaces 기준
    const total =
      selectedIndex === 0
        ? reviewList.length
        : selectedIndex === 1
          ? myRestaurants.length
          : 0;

    if (selectedIndex === 0 && visibleCount >= total) return;
    if (selectedIndex === 1 && !hasMorePlaces) return;

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
    hasMorePlaces,
  ]);

  useEffect(() => {
    if (!listLoading) return;
    const t = setTimeout(() => setListLoading(false), LOADING_DELAY_MS);
    return () => clearTimeout(t);
  }, [listLoading]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [selectedIndex]);

  /* 파생 값 */
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

  /* 이벤트 */
  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLikeToggle = async (
    restId: number,
    reviewId: number,
    currentLiked: boolean,
  ) => {
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
      await toggleReviewLike(restId, reviewId, !currentLiked);
    } catch (e) {
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

  const handleDeleteReview = async (reviewId: number) => {
    if (deletePending.has(reviewId)) {
      console.log("[delete] 이미 진행 중인 리뷰:", reviewId);
      return;
    }

    console.log("[delete] 삭제 요청 시작:", reviewId);
    setDeletePending((prev) => new Set(prev).add(reviewId));

    // 현재 리스트 스냅샷 저장 후 낙관적 제거
    const prevReviews = reviewList;
    setReviewList((prev) => prev.filter((r) => Number(r.id) !== reviewId));
    console.log(
      "[delete] 낙관적 업데이트 완료. 남은 리뷰 개수:",
      Math.max(0, prevReviews.length - 1),
    );

    try {
      const res = await deleteMyReview(reviewId);
      console.log("[delete] 서버 응답 성공:", res);
      setToastMessage("후기가 삭제되었습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error("[delete] 서버 응답 실패:", error);
      // 롤백
      setReviewList(prevReviews);
      setToastMessage("리뷰 삭제에 실패했습니다.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setDeletePending((prev) => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
      console.log("[delete] 삭제 요청 종료:", reviewId);
    }
  };

  const handleNavigateToRestaurant = (restaurantId?: string | number) => {
    if (restaurantId)
      router.push(`/restaurant/restaurant-detail/${restaurantId}`);
  };

  // 토큰 없으면 모달, 생기면 닫기
  useEffect(() => {
    if (!hasHydrated) return;
    setModalOpen(!isAuthenticated);
  }, [hasHydrated, isAuthenticated]);

  const handlePlaceLike = async (restaurantId: number) => {
    if (likePending.has(restaurantId)) return;
    setLikePending((prev) => new Set(prev).add(restaurantId));

    // 낙관적 업데이트 (UI true)
    setMyRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, isLiked: true, like: true } : r,
      ),
    );

    try {
      await likePlace(restaurantId);
      // 정상 성공 → 최신 상태 재조회
      await reloadMyPlaces();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        // 이미 찜한 상태(중복 요청) → 실패로 취급하지 않고 동기화만 수행
        await reloadMyPlaces();
      } else {
        // 그 외 에러 → 롤백
        setMyRestaurants((prev) =>
          prev.map((r) =>
            r.id === restaurantId ? { ...r, isLiked: false, like: false } : r,
          ),
        );
        setToastMessage("찜 등록에 실패했습니다.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } finally {
      setLikePending((prev) => {
        const next = new Set(prev);
        next.delete(restaurantId);
        return next;
      });
    }
  };

  const handlePlaceUnlike = async (restaurantId: number) => {
    if (likePending.has(restaurantId)) return;
    setLikePending((prev) => new Set(prev).add(restaurantId));

    // 낙관적 업데이트 (UI false)
    setMyRestaurants((prev) =>
      prev.map((r) =>
        r.id === restaurantId ? { ...r, isLiked: false, like: false } : r,
      ),
    );

    try {
      await unlikePlace(restaurantId);
      await reloadMyPlaces();
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 409) {
        // 이미 찜이 해제된 상태 → 실패로 보지 않고 동기화만
        await reloadMyPlaces();
      } else {
        // 그 외 에러 → 롤백
        setMyRestaurants((prev) =>
          prev.map((r) =>
            r.id === restaurantId ? { ...r, isLiked: true, like: true } : r,
          ),
        );
        setToastMessage("찜 해제에 실패했습니다.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    } finally {
      setLikePending((prev) => {
        const next = new Set(prev);
        next.delete(restaurantId);
        return next;
      });
    }
  };

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
        className="scrollbar-hide flex h-screen w-full flex-col items-center overflow-y-auto px-2 pt-3 pb-8"
      >
        {/* 후기 탭 */}
        {selectedIndex === 0 && (
          <>
            <section className="text-grey-normal-active flex w-full justify-end gap-1 pt-1 pr-5 pb-3 text-sm">
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
                  <div className="text-grey-normal-active flex w-full items-center justify-center py-10">
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
                      <div ref={loaderRef} className="h-px" />
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
                  <div className="text-grey-normal-active flex w-full items-center justify-center py-10">
                    등록한 맛집이 없습니다.
                  </div>
                ) : (
                  <>
                    {visiblePlaces.map((item) => (
                      <div
                        key={`${item.id}-${item.like || item.isLiked ? 1 : 0}`}
                        className="flex w-full flex-col"
                      >
                        <button
                          type="button"
                          className="text-grey-normal-active mb-1 w-full pr-2 text-end text-xs underline"
                          onClick={() => {
                            setEditing(item);
                            setEditOpen(true);
                          }}
                        >
                          편집
                        </button>
                        <FoodCard
                          isAuthenticated={isAuthenticated}
                          onRequireLogin={() => {
                            console.warn(
                              "[FoodCard] unauthenticated – opening login modal",
                            );
                            setModalOpen(true);
                          }}
                          // @ts-ignore - 단일 토글형/대체 네이밍 대응
                          onLikeToggle={() => {
                            setLastHeartClickAt(Date.now());
                            if (likePending.has(Number(item.id))) return;
                            console.log("[FoodCard:onLikeToggle]", item.id);
                            if (item.isLiked)
                              handlePlaceUnlike(Number(item.id));
                            else handlePlaceLike(Number(item.id));
                          }}
                          // @ts-ignore - 대체 네이밍(onHeartClick) 대응
                          onHeartClick={() => {
                            setLastHeartClickAt(Date.now());
                            if (likePending.has(Number(item.id))) return;
                            console.log("[FoodCard:onHeartClick]", item.id);
                            if (item.isLiked)
                              handlePlaceUnlike(Number(item.id));
                            else handlePlaceLike(Number(item.id));
                          }}
                          onClick={() => {
                            const now = Date.now();
                            if (now - lastHeartClickAt < 400) {
                              // 하트 클릭 직후에는 카드 네비게이션 무시
                              return;
                            }
                            router.push(
                              `/restaurant/restaurant-detail/${item.id}`,
                            );
                          }}
                          onLike={() => {
                            setLastHeartClickAt(Date.now());
                            if (likePending.has(Number(item.id))) return;
                            console.log("[FoodCard:onLike]", item.id);
                            handlePlaceLike(Number(item.id));
                          }}
                          onUnlike={() => {
                            setLastHeartClickAt(Date.now());
                            if (likePending.has(Number(item.id))) return;
                            console.log("[FoodCard:onUnlike]", item.id);
                            handlePlaceUnlike(Number(item.id));
                          }}
                          item={{
                            id: item.id,
                            name: item.name,
                            menus: Array.isArray(item.repre_menu)
                              ? item.repre_menu
                              : typeof item.repre_menu === "string"
                                ? [item.repre_menu]
                                : [],
                            rating: item.rating || 0,
                            images: item.images
                              ? item.images.map((img) => img.link ?? "")
                              : [],
                            address: item.address ?? "",
                            rest_tag: [],
                            // 서버/로컬 중 하나라도 true면 채운 하트로 표시되도록 OR 사용
                            like: Boolean(item.like || item.isLiked),
                            // @ts-ignore - FoodCard가 참조하는 대체 필드도 동일 기준으로 전달
                            isLiked: Boolean(item.isLiked || item.like),
                            reviews: 0,
                          }}
                        />
                      </div>
                    ))}
                    {(hasMorePlaces || fetchingPlaces) && (
                      <div ref={loaderRef} className="h-px" />
                    )}
                  </>
                )}
              </section>
            )}
          </>
        )}

        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />

        {showToast && (
          <Toast message={toastMessage} show={showToast} className="w-full" />
        )}
      </main>

      {/* 인증 모달: 하이드레이션 이후에만 판단 */}
      {hasHydrated && modalOpen && (
        <AuthErrorModalSection
          isOpen={modalOpen}
          onConfirm={() => {
            setModalOpen(false);
            router.push(`/sign-in`);
          }}
          onClose={() => setModalOpen(false)}
        />
      )}

      {editOpen && editing && (
        <RestaurantEditModal
          initial={{
            id: editing.id,
            name: editing.name,
            repre_menu: Array.isArray(editing.repre_menu)
              ? (editing.repre_menu as unknown as string[])
              : editing.repre_menu
                ? [String(editing.repre_menu)]
                : [],
            opening_hour: undefined as unknown as Record<string, string>, // 서버에서 제공되지 않으면 비워둠
            address: editing.address ?? "",
            imageUrl:
              editing.images && editing.images.length > 0
                ? editing.images[0].link
                : null,
          }}
          onSubmit={async (p: UpdateRestaurantPayload & { id: number }) => {
            try {
              const res = await updateRestaurant(p.id, {
                name: p.name,
                repre_menu: p.repre_menu,
                opening_hour: p.opening_hour,
                address: p.address,
                ...(p.imageUrl ? { imageUrl: p.imageUrl } : {}),
              });

              // 로컬 목록도 수정 반영
              setMyRestaurants((prev) =>
                prev.map((r) =>
                  r.id === p.id
                    ? {
                        ...r,
                        name: p.name,
                        repre_menu: p.repre_menu as any,
                        address: p.address,
                        images: p.imageUrl ? [{ link: p.imageUrl }] : r.images,
                      }
                    : r,
                ),
              );

              // 서버 소스 기준으로 최종 동기화
              await reloadMyPlaces();

              setToastMessage("맛집 정보가 수정되었습니다.");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            } catch (e) {
              console.error(e);
              setToastMessage("수정에 실패했습니다.");
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2500);
            } finally {
              setEditOpen(false);
              setEditing(null);
            }
          }}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
        />
      )}
    </>
  );
}
