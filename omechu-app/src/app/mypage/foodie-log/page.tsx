/* eslint-disable react-hooks/rules-of-hooks */
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

/* ──────────────────────────────────────────────────────────────
 * Constants
 * ────────────────────────────────────────────────────────────── */
const PERIOD_OPTIONS = [
  "전체",
  "1주",
  "1개월",
  "3개월",
  "6개월",
  "1년",
  "직접입력",
] as const;

const INITIAL_VISIBLE = 9; // 3 x 3 그리드 기준
const ITEMS_PER_CHUNK = 9; // 한 번에 추가 로드할 개수
const LOADING_TIMEOUT = 1800; // 리스트 로딩 스피너 노출 시간(ms)

/* ──────────────────────────────────────────────────────────────
 * Helpers
 *  - 한글 정규화(NFC/NFD), 제어문자/특수공백 제거
 *  - 이미지 경로 후보 생성(대소문자 확장자, NFC/NFD)
 *  - 디버깅 유틸
 * ────────────────────────────────────────────────────────────── */
const cleanCommon = (str: string) =>
  str
    .replace(/["'“”‘’]/g, "")
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, "") // 제어문자 제거
    .replace(/[\u115F\u1160\u3164\uFE0F]/g, "") // 한글 채움/가변 선택자 제거
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, " ") // 다양한 공백 → 일반 공백
    .replace(/\s+/g, " ")
    .trim();

/** UI 표시용 이름 정규화 (길이가 더 온전한 쪽을 사용) */
const normalizeName = (s?: unknown) => {
  if (typeof s !== "string") return "";
  const nfc = cleanCommon(s.normalize("NFC"));
  const nfd = cleanCommon(s.normalize("NFD"));
  return nfd.length > nfc.length ? nfd : nfc || nfd || s.trim();
};

/** S3 이미지 경로 후보들 (OS별 정규화 + 확장자 케이스) */
const buildMenuImageCandidates = (menuName?: string | null): string[] => {
  if (typeof menuName !== "string") return [];
  const base =
    "https://omechu-s3-bucket.s3.ap-northeast-2.amazonaws.com/menu_image/";
  const raw = cleanCommon(menuName.normalize("NFC"));
  if (!raw) return [];

  const nfc = raw.normalize("NFC");
  const nfd = raw.normalize("NFD");
  const enc = (s: string) => encodeURIComponent(s);

  return [
    `${base}${enc(nfc)}.png`,
    `${base}${enc(nfc)}.PNG`,
    `${base}${enc(nfd)}.png`,
    `${base}${enc(nfd)}.PNG`,
  ];
};

/** 단일 URL (첫 번째 후보) */
const buildMenuImageUrl = (menuName?: string | null) => {
  const c = buildMenuImageCandidates(menuName);
  return c.length ? c[0] : null;
};

/** 코드포인트 덤프 (개발 디버깅용) */
const dumpCodes = (s: string) =>
  Array.from(s)
    .map((ch) => ch.charCodeAt(0).toString(16).padStart(4, "0"))
    .join(" ");

/* ──────────────────────────────────────────────────────────────
 * Period / Date Range
 * ────────────────────────────────────────────────────────────── */
type DateRange = { startDate: string | null; endDate: string | null };

/** 기간/날짜를 API 파라미터로 변환 (메모) */
const useQueryParams = (selectedPeriod: string, range: DateRange) =>
  useMemo(() => {
    const isCustom = selectedPeriod === "직접입력";
    if (isCustom) {
      if (!range.startDate || !range.endDate) return undefined;
      return {
        period: "직접입력" as PeriodOption,
        startDate: range.startDate,
        endDate: range.endDate,
      };
    }
    return { period: selectedPeriod as PeriodOption };
  }, [selectedPeriod, range.startDate, range.endDate]);

/* ──────────────────────────────────────────────────────────────
 * Component
 * ────────────────────────────────────────────────────────────── */
export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 인증/하이드레이션
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  // 조회 조건
  const [selectedPeriod, setSelectedPeriod] = useState<string>("전체");
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  // 정렬/페이지네이션
  const [sortOrder, setSortOrder] = useState<"MostLogged" | "LatestLogged">(
    "MostLogged",
  );
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [listLoading, setListLoading] = useState(false);

  // 서버 데이터
  const [stats, setStats] = useState<MukburimStats | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // 파라미터 메모
  const queryParams = useQueryParams(selectedPeriod, range);

  // 전체 아이템 수
  const totalCount = useMemo(
    () =>
      Array.isArray(stats?.menuStatistics) ? stats!.menuStatistics.length : 0,
    [stats?.menuStatistics],
  );

  // 정렬 + 슬라이스
  const visibleMenus = useMemo(() => {
    const base = Array.isArray(stats?.menuStatistics)
      ? stats!.menuStatistics
      : [];
    const sorted =
      sortOrder === "MostLogged"
        ? [...base].sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
        : base; // (최신 순은 서버에서 정렬되어 온다고 가정)
    return sorted.slice(0, visibleCount);
  }, [stats?.menuStatistics, sortOrder, visibleCount]);

  /* 스크롤 최상단 */
  const scrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* 기간 변경 시 초기화 */
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

  /* 무한 스크롤 옵저버 */
  const observerCallback = useCallback(
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

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 160px 0px",
      threshold: 0,
    });

    const node = loaderRef.current;
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [observerCallback, visibleCount, totalCount]);

  useEffect(() => {
    if (!listLoading) return;
    const t = setTimeout(() => setListLoading(false), LOADING_TIMEOUT);
    return () => clearTimeout(t);
  }, [listLoading]);

  /* 데이터 패칭 */
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

    let aborted = false;
    (async () => {
      try {
        setFetching(true);
        setFetchError(null);
        const data = await fetchMukburimStats(queryParams!);
        if (!aborted) setStats(data);
      } catch (e: any) {
        if (!aborted) {
          setStats(null);
          setFetchError(e?.message ?? "먹부림 통계 조회 실패");
        }
      } finally {
        if (!aborted) setFetching(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [hasHydrated, accessToken, selectedPeriod, queryParams]);

  /* ──────────────────────────────────────────────────────────
   * Render
   * ────────────────────────────────────────────────────────── */
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
            <CustomDatePicker
              onChange={useCallback((s: Date | null, e: Date | null) => {
                setRange((prev) => {
                  const next = {
                    startDate: s ? dayjs(s).format("YYYY-MM-DD") : null,
                    endDate: e ? dayjs(e).format("YYYY-MM-DD") : null,
                  };
                  if (
                    prev.startDate === next.startDate &&
                    prev.endDate === next.endDate
                  )
                    return prev;
                  return next;
                });
              }, [])}
            />
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
                const rawName = m?.menu_name;
                // 화면 표시는 NFC 기준으로 고정
                const nameNFC = cleanCommon(
                  String(rawName ?? "").normalize("NFC"),
                );
                const name = nameNFC;
                const candidates = buildMenuImageCandidates(rawName);
                const url = candidates[0] ?? null;

                if (process.env.NODE_ENV === "development") {
                  const safeRaw = rawName ?? "";
                  const disp = name;
                  console.log("[FoodieLog] raw:", safeRaw, dumpCodes(safeRaw));
                  console.log("[FoodieLog] disp(NFC):", disp, dumpCodes(disp));
                  console.log("[FoodieLog] url:", url);
                }

                return (
                  <div
                    key={`${name || "no-name"}-${idx}`}
                    className="flex h-[130px] w-[100px] cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border border-black bg-white py-3"
                    title={name || "(이름 없음)"}
                  >
                    {url ? (
                      <img
                        src={url}
                        alt={`${name || "이미지"} 이미지`}
                        width={70}
                        height={70}
                        className="h-[70px] w-[70px] rounded-lg object-cover"
                        data-src-idx="0"
                        data-src-candidates={candidates.join("|")}
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          const list = (
                            img.getAttribute("data-src-candidates") || ""
                          )
                            .split("|")
                            .filter(Boolean);
                          let idx = parseInt(
                            img.getAttribute("data-src-idx") || "0",
                            10,
                          );

                          // 다음 후보로 교체
                          if (idx < list.length - 1) {
                            idx += 1;
                            img.setAttribute("data-src-idx", String(idx));
                            img.src = list[idx];
                            if (process.env.NODE_ENV === "development") {
                              console.warn(
                                "[FoodieLog] retry image with candidate:",
                                list[idx],
                                "for name:",
                                name,
                              );
                            }
                            return;
                          }

                          // 모든 후보 실패 → 로컬 기본 이미지로 폴백
                          if ((img as any).dataset.fallbackApplied) return;
                          (img as any).dataset.fallbackApplied = "1";

                          console.warn(
                            "[FoodieLog] image 404 fallback -> /logo/logo.png for name:",
                            name,
                          );
                          img.src = "/logo/logo.png";
                        }}
                      />
                    ) : (
                      <div className="h-[70px] w-[70px] rounded-lg bg-gray-200" />
                    )}

                    <div className="line-clamp-2 px-2 text-center text-[15px] leading-tight text-grey-darker">
                      {name || "(이름 없음)"}
                      {process.env.NODE_ENV === "development" && (
                        <span className="ml-1 text-[10px] text-gray-400">
                          (NFC)
                        </span>
                      )}
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
