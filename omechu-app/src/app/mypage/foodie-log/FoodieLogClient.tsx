/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";

import { useAuthStore } from "@/lib/stores/auth.store";
import {
  fetchMukburimStats,
  type MukburimStats,
  type PeriodOption,
} from "@/mypage/api/mukburim";

import CustomDatePicker from "@/components/common/CustomDatePicker";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import Header from "@/components/common/Header";
import SkeletonUIFoodBox from "@/components/common/SkeletonUIFoodBox";

/* ---------- constants ---------- */
const PERIOD_OPTIONS = [
  "전체",
  "1주",
  "1개월",
  "3개월",
  "6개월",
  "1년",
  "직접입력",
] as const;

type Period = (typeof PERIOD_OPTIONS)[number];

const INITIAL_VISIBLE = 9; // 3x3
const ITEMS_PER_CHUNK = 9;
const LOADING_TIMEOUT = 1800;

/* ---------- helpers ---------- */
const displayLabel = (s?: unknown) => (typeof s === "string" ? s.trim() : "");

const buildMenuImageUrl = (menuName?: string | null): string | null => {
  if (typeof menuName !== "string") return null;
  const trimmed = menuName.trim();
  if (!trimmed) return null;
  const base =
    "https://omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com/menu_image/";
  return `${base}${encodeURIComponent(trimmed.toLowerCase())}.png`;
};

type DateRange = { startDate: string | null; endDate: string | null };

const useQueryParams = (selectedPeriod: Period, range: DateRange) =>
  useMemo(() => {
    if (selectedPeriod === "직접입력") {
      if (!range.startDate || !range.endDate) return undefined;
      return {
        period: "직접입력" as PeriodOption,
        startDate: range.startDate,
        endDate: range.endDate,
      };
    }
    return { period: selectedPeriod as PeriodOption };
  }, [selectedPeriod, range.startDate, range.endDate]);

/* ---------- component ---------- */
export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const [sortOrder, setSortOrder] = useState<"MostLogged" | "LatestLogged">(
    "MostLogged",
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [listLoading, setListLoading] = useState(false);

  const [stats, setStats] = useState<MukburimStats | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const queryParams = useQueryParams(selectedPeriod, range);

  const totalCount = useMemo(
    () =>
      Array.isArray(stats?.menuStatistics) ? stats!.menuStatistics.length : 0,
    [stats?.menuStatistics],
  );

  const visibleMenus = useMemo(() => {
    const base = Array.isArray(stats?.menuStatistics)
      ? stats!.menuStatistics
      : [];
    const sorted =
      sortOrder === "MostLogged"
        ? [...base].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        : base;
    return sorted.slice(0, visibleCount);
  }, [stats?.menuStatistics, sortOrder, visibleCount]);

  const scrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* reset on period change */
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
    if (selectedPeriod !== "직접입력") {
      setRange((prev) =>
        prev.startDate === null && prev.endDate === null
          ? prev
          : { startDate: null, endDate: null },
      );
    }
  }, [selectedPeriod]);

  /* infinite scroll */
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (!target.isIntersecting) return;
      if (listLoading) return;
      if (visibleCount >= totalCount) return;

      setListLoading(true);
      setVisibleCount((prev) => Math.min(prev + ITEMS_PER_CHUNK, totalCount));
    },
    [listLoading, visibleCount, totalCount],
  );

  useEffect(() => {
    if (visibleCount >= totalCount) return;
    const observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });
    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, visibleCount, totalCount]);

  useEffect(() => {
    if (!listLoading) return;
    const t = setTimeout(() => setListLoading(false), LOADING_TIMEOUT);
    return () => clearTimeout(t);
  }, [listLoading]);

  /* fetch */
  useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      if (stats !== null) setStats(null);
      return;
    }
    if (selectedPeriod === "직접입력" && !queryParams) {
      if (stats !== null) setStats(null);
      return;
    }

    let canceled = false;
    (async () => {
      try {
        setFetching(true);
        setFetchError(null);
        const data = await fetchMukburimStats(queryParams!);
        if (!canceled) setStats(data);
      } catch (e: any) {
        if (!canceled) {
          setStats(null);
          setFetchError(e?.message ?? "먹부림 통계 조회 실패");
        }
      } finally {
        if (!canceled) setFetching(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [hasHydrated, accessToken, selectedPeriod, queryParams]);

  const handleDateRangeChange = useCallback(
    (s: Date | null, e: Date | null) => {
      setRange((prev) => {
        const next = {
          startDate: s ? dayjs(s).format("YYYY-MM-DD") : null,
          endDate: e ? dayjs(e).format("YYYY-MM-DD") : null,
        };
        return prev.startDate === next.startDate &&
          prev.endDate === next.endDate
          ? prev
          : next;
      });
    },
    [],
  );

  /* ---------- render ---------- */
  return (
    <>
      <Header
        title="먹부림 기록"
        leftChild={
          <Link href="/mypage">
            <img
              src="/arrow/left-header-arrow.svg"
              alt="뒤로가기"
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
        {/* 기간 탭 */}
        <section className="flex h-fit w-full items-center justify-center gap-0.5 px-1 pt-2">
          {PERIOD_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => setSelectedPeriod(item)}
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

        {/* 직접입력일 때: 날짜 범위 */}
        {selectedPeriod === "직접입력" && (
          <section className="-mt-1 flex h-fit w-full items-center justify-center gap-3 border-t-[1px] border-grey-normalActive px-1 py-3">
            <CustomDatePicker onChange={handleDateRangeChange} />
          </section>
        )}

        {/* 정렬 */}
        <section className="-mt-1 flex w-full justify-end gap-3 border-t-[1px] border-grey-normalActive pr-3 pt-4 text-sm text-grey-normalActive">
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

        {/* 요약/기간 */}
        {stats && (
          <section className="my-2 w-full px-3 text-xs text-grey-normalActive">
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

        {/* 리스트 */}
        <section className="flex w-full items-center justify-center">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {fetching || listLoading ? (
              Array.from({ length: visibleCount }).map((_, i) => (
                <SkeletonUIFoodBox key={`sk-${i}`} />
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
              visibleMenus.map((m, idx) => {
                const rawName = m?.menu_name ?? "";
                const name = displayLabel(rawName);
                const url = buildMenuImageUrl(rawName);

                return (
                  <div
                    key={`${name || "no-name"}-${idx}`}
                    className="flex h-fit w-[100px] cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border border-black bg-white py-3"
                    title={name || "(이름 없음)"}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={`${name || "이미지"} 이미지`}
                        width={70}
                        height={70}
                        className="h-[70px] w-[70px] rounded-lg object-cover"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          if ((img as any).dataset.fallbackApplied) return;
                          (img as any).dataset.fallbackApplied = "1";
                          img.src = "/logo/logo.png";
                        }}
                      />
                    ) : (
                      <div className="h-[70px] w-[70px] rounded-lg bg-gray-200" />
                    )}

                    <div className="line-clamp-2 px-2 text-center text-[15px] leading-tight text-grey-darker">
                      {name || "(이름 없음)"}
                    </div>
                    <div className="text-xs text-gray-500">
                      총 {m.count ?? 0}회
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />

        {visibleCount < totalCount && (
          <div ref={loaderRef} className="h-[1px]" />
        )}

        {listLoading && visibleCount < totalCount && (
          <div className="mt-4 flex h-20 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800" />
            <span className="ml-2 text-sm text-gray-600">로딩 중...</span>
          </div>
        )}
      </main>
    </>
  );
}
