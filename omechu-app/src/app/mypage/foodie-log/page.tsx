/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
  fetchMukburimStats,
  type MukburimStats,
  type PeriodOption,
} from "@/mypage/api/mukburim"; // 경로는 네가 만든 파일 경로에 맞춰

import Link from "next/link";

import CustomDatePicker from "@/components/common/CustomDatePicker";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import Header from "@/components/common/Header";
// import FoodieBox from "@/components/mypage/FoodieBox";
import SkeletonUIFoodBox from "@/components/common/SkeletonUIFoodBox";
import dayjs from "dayjs";

const PERIOD_OPTIONS = [
  "전체",
  "1주",
  "1개월",
  "3개월",
  "6개월",
  "1년",
  "직접입력",
];

const ITEMS_PER_PAGE = 10;
const LOADING_TIMEOUT = 1800;

// 메뉴 이름을 S3 이미지 경로로 변환(공백/한글 안전 인코딩)
const buildMenuImageUrl = (menuName?: string | null) => {
  if (!menuName) return null;
  // 파일명은 소문자/PNG 확장자 가정 -> 서버에 맞춰 필요시 조정
  const encoded = encodeURIComponent(menuName);
  return `https://omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com/menu_image/${encoded}.png`;
};

type DateRange = { startDate: string | null; endDate: string | null };

export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedPeriod, setSelectedPeriod] = useState("전체");
  const [sortOrder, setSortOrder] = useState<"MostLogged" | "LatestLogged">(
    "MostLogged",
  );

  // 직접입력용 기간 상태
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const scrollToTop = () => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 인증/하이드레이션
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  // 서버 데이터 상태
  const [stats, setStats] = useState<MukburimStats | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const observerCallback = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting || isLoading) return;

      setIsLoading(true);
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE); // 필요한 만큼 늘리기
    },
    [isLoading],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [observerCallback]);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setIsLoading(false), LOADING_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    setVisibleCount(5); // 초기화
    if (selectedPeriod !== "직접입력") {
      // 직접입력 해제 시 이전 날짜 초기화
      setRange({ startDate: null, endDate: null });
    }
  }, [selectedPeriod, sortOrder]); // 정렬/기간이 바뀌면 리셋

  // 실제 데이터 패칭
  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      setStats(null);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      try {
        setFetching(true);
        setFetchError(null);

        // 직접입력은 날짜가 둘 다 있어야 호출
        const isCustom = selectedPeriod === "직접입력";
        const params = isCustom
          ? {
              period: "직접입력" as PeriodOption,
              startDate: range.startDate ?? undefined,
              endDate: range.endDate ?? undefined,
            }
          : { period: selectedPeriod as PeriodOption };

        if (isCustom && (!params.startDate || !params.endDate)) {
          // 날짜가 정해지기 전에는 호출하지 않음
          setStats(null);
          return;
        }

        const data = await fetchMukburimStats(params);
        setStats(data);
      } catch (e: any) {
        setStats(null);
        setFetchError(e?.message ?? "먹부림 통계 조회 실패");
      } finally {
        setFetching(false);
      }
    };

    run();

    return () => controller.abort();
  }, [
    hasHydrated,
    accessToken,
    selectedPeriod,
    sortOrder,
    range.startDate,
    range.endDate,
  ]);
  return (
    <>
      <Header
        title={"먹부림 기록"}
        leftChild={
          <Link href={"/mypage"}>
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"뒤로가기"}
              width={22}
              height={30}
            />
          </Link>
        }
      />
      <main
        ref={mainRef}
        className="flex h-screen w-full flex-col overflow-y-auto px-4 scrollbar-hide"
      >
        {/* 기간 설정 Tab */}
        <section className="flex h-fit w-full items-center justify-center gap-0.5 px-1 pt-2">
          {PERIOD_OPTIONS.map((item, idx) => (
            <button
              key={`${item}-${idx}`}
              onClick={() => {
                setSelectedPeriod(item);
              }}
              className={`mx-0.5 px-1 pb-2 pt-1 text-base hover:bg-main-normalHover ${
                selectedPeriod === item
                  ? "border-b-[3px] border-black font-bold text-grey-darker"
                  : "font-normal text-[#716F6C]"
              }`}
            >
              {item}
            </button>
          ))}
        </section>
        {/* 기간 입력 Tab (직접입력일 때만 보여짐) */}
        {selectedPeriod === "직접입력" && (
          <section className="-mt-1 flex h-fit w-full items-center justify-center gap-3 border-t-[1px] border-grey-normalActive px-1 py-3">
            {/* TODO: CustomDatePicker의 실제 props에 맞춰 변환 필요 */}
            <CustomDatePicker
              onChange={(s: Date | null, e: Date | null) => {
                setRange({
                  startDate: s ? dayjs(s).format("YYYY-MM-DD") : null,
                  endDate: e ? dayjs(e).format("YYYY-MM-DD") : null,
                });
              }}
            />
          </section>
        )}

        {/* 필터 - 추천 순 | 최신 순 */}
        <section className="-mt-1 flex w-full justify-end gap-3 border-t-[1px] border-grey-normalActive py-4 pr-3 text-sm text-grey-normalActive">
          <button
            className={
              sortOrder === "MostLogged" ? "font-semibold text-grey-darker" : ""
            }
            onClick={() => setSortOrder("MostLogged")}
          >
            많이 먹은 순
          </button>
          <span>|</span>
          <button
            className={
              sortOrder === "LatestLogged"
                ? "font-semibold text-grey-darker"
                : ""
            }
            onClick={() => setSortOrder("LatestLogged")}
          >
            최근 먹은 순
          </button>
        </section>

        {/* 요약/기간 표시 */}
        {stats && (
          <section className="mb-2 mt-1 w-full text-xs text-grey-normalActive">
            <div className="flex items-center justify-between">
              <span>{stats.dateRange?.displayRange}</span>
              <span>
                총 {stats.summary?.totalRecords ?? 0}회 / 고유메뉴{" "}
                {stats.summary?.uniqueMenus ?? 0}개 / 일평균{" "}
                {stats.summary?.averagePerDay ?? 0}
              </span>
            </div>
          </section>
        )}

        {/* FoodieLog List */}
        <section className="flex w-full items-center justify-center">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {fetching || isLoading ? (
              Array.from({ length: visibleCount }).map((_, idx) => (
                <SkeletonUIFoodBox key={`sk-${idx}`} />
              ))
            ) : fetchError ? (
              <div className="col-span-3 py-8 text-center text-sm text-red-600">
                {fetchError}
              </div>
            ) : selectedPeriod === "직접입력" &&
              (!range.startDate || !range.endDate) ? (
              <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                조회할 날짜 범위를 선택해 주세요.
              </div>
            ) : !stats ? (
              <div className="col-span-3 py-8 text-center text-sm text-gray-500">
                데이터가 없습니다.
              </div>
            ) : (
              (() => {
                // 서버 응답에서 메뉴 통계 사용
                const base = Array.isArray(stats.menuStatistics)
                  ? stats.menuStatistics
                  : [];

                const sorted =
                  sortOrder === "MostLogged"
                    ? [...base].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
                    : base; // "최근" 기준이 없으므로 일단 원본 유지 (추후 createdAt 등 생기면 교체)

                const visible = sorted.slice(0, visibleCount);

                return visible.map((m, idx) => (
                  <div
                    key={`${m.menu_name}-${idx}`}
                    className="flex h-[130px] w-[100px] cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border border-black bg-white py-3"
                    title={m.menu_name}
                  >
                    {(() => {
                      const url = buildMenuImageUrl(m.menu_name);
                      return url ? (
                        // onError로 레이아웃 깨짐 방지
                        <img
                          src={url}
                          alt={`${m.menu_name} 이미지`}
                          width={70}
                          height={70}
                          className="h-[70px] w-[70px] rounded-lg object-cover"
                          onError={(e) => {
                            // 실패 시 회색 박스로 대체
                            const target = e.currentTarget;
                            const parent = target.parentElement;
                            if (parent) {
                              target.style.display = "none";
                              const fallback = document.createElement("div");
                              fallback.className =
                                "h-[70px] w-[70px] rounded-lg bg-gray-200";
                              parent.insertBefore(fallback, target.nextSibling);
                            }
                          }}
                        />
                      ) : (
                        <div className="h-[70px] w-[70px] rounded-lg bg-gray-200" />
                      );
                    })()}
                    <div className="line-clamp-2 px-2 text-center text-[15px] leading-tight">
                      {m.menu_name}
                    </div>
                    <div className="text-xs text-gray-500">총 {m.count}회</div>
                  </div>
                ));
              })()
            )}
          </div>
        </section>
        <FloatingActionButton onClick={scrollToTop} className={"bottom-4"} />

        <div ref={loaderRef} className="h-[1px]" />

        {isLoading && (
          <div className="mt-4 flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}
      </main>
    </>
  );
}
