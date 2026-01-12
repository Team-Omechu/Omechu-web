/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Link from "next/link";

import dayjs from "dayjs";

import CustomDatePicker from "@/components/common/CustomDatePicker";
import FloatingActionButton from "@/components/common/FloatingActionButton";
import Header from "@/components/common/Header";
import { SkeletonUIFoodBox } from "@/shared_FSD/index";

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

/* ---------- mock data ---------- */
const MOCK_MENUS = Array.from({ length: 24 }).map((_, i) => ({
  menu_name: `샘플 메뉴 ${i + 1}`,
  count: Math.floor(Math.random() * 10) + 1,
}));

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

/* ---------- component ---------- */
export default function FoodieLog() {
  const mainRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [range, setRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [listLoading, setListLoading] = useState(false);

  const totalCount = MOCK_MENUS.length;

  const visibleMenus = useMemo(
    () => MOCK_MENUS.slice(0, visibleCount),
    [visibleCount],
  );

  const scrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  const renderContent = () => {
    if (selectedPeriod === "직접입력" && (!range.startDate || !range.endDate)) {
      return (
        <div className="col-span-3 py-8 text-center text-sm text-gray-500">
          조회할 날짜 범위를 선택해 주세요.
        </div>
      );
    }

    return visibleMenus.map((m, idx) => {
      const rawName = m?.menu_name ?? "";
      const name = displayLabel(rawName);
      const url = buildMenuImageUrl(rawName);

      return (
        <div
          key={`${name || "no-name"}-${idx}`}
          className="border-grey-dark-hover flex h-fit w-25 cursor-pointer flex-col items-center justify-start gap-2 rounded-xl border bg-white py-3"
          title={name || "(이름 없음)"}
        >
          {url ? (
            <img
              src={url}
              alt={`${name || "이미지"} 이미지`}
              width={70}
              height={70}
              className="h-17.5 w-17.5 rounded-lg object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.dataset.fallbackApplied === "1") return;
                img.dataset.fallbackApplied = "1";
                img.src = "/logo/logo.png";
              }}
            />
          ) : (
            <div className="h-17.5 w-17.5 rounded-lg bg-gray-200" />
          )}

          <div className="text-grey-darker line-clamp-2 px-2 text-center text-[15px] leading-tight">
            {name || "(이름 없음)"}
          </div>
          <div className="text-xs text-gray-500">총 {m.count ?? 0}회</div>
        </div>
      );
    });
  };

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
        className="scrollbar-hide flex h-screen w-full flex-col overflow-y-auto px-4"
      >
        {/* 기간 탭 */}
        <section className="flex h-fit w-full items-center justify-center gap-0.5 px-1 pt-2">
          {PERIOD_OPTIONS.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelectedPeriod(item);
                setVisibleCount(INITIAL_VISIBLE);
                if (item !== "직접입력") {
                  setRange({ startDate: null, endDate: null });
                }
              }}
              className={`hover:bg-main-normal-hover mx-0.5 px-1 pt-1 pb-2 text-base ${
                selectedPeriod === item
                  ? "border-grey-dark-hover text-grey-darker border-b-[3px] font-bold"
                  : "font-normal text-[#716F6C]"
              }`}
            >
              {item}
            </button>
          ))}
        </section>

        {/* 직접입력일 때: 날짜 범위 */}
        {selectedPeriod === "직접입력" && (
          <section className="border-grey-darkHoverActive -mt-1 flex h-fit w-full items-center justify-center gap-3 border-t px-1 py-3">
            <CustomDatePicker onChange={handleDateRangeChange} />
          </section>
        )}

        {/* 요약/기간 */}
        <section className="text-grey-normal-active my-2 w-full px-3 text-xs">
          <div className="flex items-center justify-between">
            <span></span>
            <span>
              총 {totalCount}회 / 고유메뉴 {totalCount}개 / 일평균 0
            </span>
          </div>
        </section>

        {/* 리스트 */}
        <section className="flex w-full items-center justify-center">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {renderContent()}
          </div>
        </section>

        <FloatingActionButton onClick={scrollToTop} className="bottom-4" />

        {visibleCount < totalCount && <div ref={loaderRef} className="h-px" />}

        {listLoading && visibleCount < totalCount && <SkeletonUIFoodBox />}
      </main>
    </>
  );
}
