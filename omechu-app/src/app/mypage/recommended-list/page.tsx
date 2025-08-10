/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import FloatingActionButton from "@/components/common/FloatingActionButton";
import FoodBox from "@/components/common/FoodBox";
import Header from "@/components/common/Header";
import SearchBar from "@/components/common/SearchBar";
import SelectTabBar from "@/components/mypage/SelectTabBar";
import {
  consonantGroupMap,
  filteredChoSeong,
  HANGUL_CHO_SEONG,
} from "@/constant/choSeong";
import { suggestionList } from "@/constant/suggestionList";

import AuthErrorModal from "../AuthErrorModalSection";
import { useAuthStore } from "@/auth/store";
import {
  fetchRecommendManagement,
  exceptMenu,
  removeExceptMenu,
} from "../api/recommend";
import Toast from "@/components/common/Toast";

// FoodItem 타입을 정의하거나 import
type FoodItem = {
  id?: number;
  title: string;
  imageUrl: string;
  isExcluded: boolean;
};

export default function RecommendedList() {
  const router = useRouter();
  const mainRef = useRef<HTMLDivElement>(null);

  const isJustResetRef = useRef(false); // 최근 입력 초기화 여부 체크
  const pendingRef = useRef<Set<number | string>>(new Set());

  // 인증/하이드레이션
  const user = useAuthStore((s) => s.user);
  const accessToken = user?.accessToken;
  const hasHydrated = useAuthStore.persist?.hasHydrated?.() ?? false;

  // 서버 데이터/상태
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // 토스트 알림
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(0); // 추천/제외 탭 인덱스
  const [selectedAlphabetIndex, setSelectedAlphabetIndex] = useState<
    number | undefined
  >(undefined); // 초성 필터 인덱스

  const [searchTerm, setSearchTerm] = useState(""); // input에 입력 중인 검색어
  const [submittedTerm, setSubmittedTerm] = useState(""); // 검색 확정된 키워드

  // 서버에서 추천/제외 목록 불러오기
  useEffect(() => {
    if (!hasHydrated) return;

    // 토큰 없으면 로그인 요구 모달
    if (!accessToken) {
      setModalOpen(true);
      setFoodList([]);
      return;
    }

    setLoading(true);
    setError(null);

    fetchRecommendManagement()
      .then((res: any) => {
        // 응답 구조:
        // { success: { summary, recommendMenus: [...], exceptedMenus: [...] } }
        const recommend = res?.success?.recommendMenus ?? [];
        const excepted = res?.success?.exceptedMenus ?? [];

        // recommendMenus / exceptedMenus 를 하나의 리스트로 합치며 isExcluded 플래그를 세팅
        const merged: FoodItem[] = [
          ...recommend.map((m: any) => ({
            id: Number(m.id), // ← 추가
            title: m.name ?? "",
            imageUrl: m.image_link ?? "",
            isExcluded: false,
          })),
          ...excepted.map((m: any) => ({
            id: Number(m.id), // ← 추가
            title: m.name ?? "",
            imageUrl: m.image_link ?? "",
            isExcluded: true,
          })),
        ].sort((a, b) => a.title.localeCompare(b.title, "ko"));

        setFoodList(merged);
        setModalOpen(false);
      })
      .catch((e: any) => {
        if (e?.response?.status === 401) {
          setModalOpen(true);
        } else {
          setError("추천 목록을 불러오지 못했습니다.");
        }
        setFoodList([]);
      })
      .finally(() => setLoading(false));
  }, [hasHydrated, accessToken]);

  // 검색 실행 핸들러
  const handleSearch = (term: string) => {
    const trimmed = term.trim();

    // 입력이 비면 검색 해제
    if (trimmed === "") {
      setSubmittedTerm("");
      isJustResetRef.current = false;
      return;
    }

    // 같은 키워드는 무시
    if (trimmed === submittedTerm) return;

    // 새로운 키워드 제출
    setSubmittedTerm(trimmed);
    isJustResetRef.current = true;
    setSearchTerm("");
    // 다음 틱에 리셋 플래그 초기화 (불필요한 차단 방지)
    setTimeout(() => {
      isJustResetRef.current = false;
    }, 0);
  };
  // 한글 자음 추출 함수 (초성 기준 분류용)
  const getInitialConsonant = (char: string): string => {
    if (!char) return "";
    const code = char.charCodeAt(0);

    // 한글 음절 범위 (AC00-D7A3) 외 문자면 그대로 첫 글자 반환
    if (code < 0xac00 || code > 0xd7a3) {
      return char[0];
    }

    const choIndex = Math.floor((code - 0xac00) / 588);
    return HANGUL_CHO_SEONG[choIndex] ?? "";
  };

  // 추천/제외 toggle 기능 (중복 클릭 방지 + 토스트 알림)
  const onToggle = async (target: FoodItem) => {
    const key = typeof target.id === "number" ? target.id : target.title;

    // 중복 클릭 방지
    if (pendingRef.current.has(key)) return;
    pendingRef.current.add(key);

    // 1) 낙관적 업데이트
    setFoodList((prev) =>
      prev.map((it) =>
        it.title === target.title ? { ...it, isExcluded: !it.isExcluded } : it,
      ),
    );

    const willExclude = !target.isExcluded; // 토글 후 상태 기준으로 API 선택

    try {
      if (willExclude) {
        // 제외 목록에 추가
        if (typeof target.id === "number") {
          await exceptMenu({ menuId: target.id });
        } else {
          await exceptMenu({ menuName: target.title });
        }
        setToastMessage(`'${target.title}'를 제외 목록에 추가했습니다.`);
      } else {
        // 제외 목록에서 제거
        if (typeof target.id === "number") {
          await removeExceptMenu({ menuId: target.id });
        } else {
          await removeExceptMenu({ menuName: target.title });
        }
        setToastMessage(`'${target.title}'를 제외 목록에서 해제했습니다.`);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (e) {
      // 2) 실패 시 롤백
      setFoodList((prev) =>
        prev.map((it) =>
          it.title === target.title
            ? { ...it, isExcluded: target.isExcluded }
            : it,
        ),
      );
      console.error(e);
      setToastMessage("변경을 적용하지 못했어요. 잠시 후 다시 시도해주세요.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 0);
    } finally {
      pendingRef.current.delete(key);
    }
  };

  // 필터링된 음식 리스트 반환
  const filteredFoodList = foodList
    .filter((item) => item.isExcluded === (selectedIndex === 1))
    .filter((item) => {
      if (selectedAlphabetIndex === undefined) return true;
      const selectedConsonant = filteredChoSeong[selectedAlphabetIndex];
      const group = consonantGroupMap[selectedConsonant] || [];
      return group.includes(getInitialConsonant(item.title));
    })
    .filter((item) => {
      if (submittedTerm === "") return true;
      return item.title.toLowerCase().includes(submittedTerm.toLowerCase());
    });

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* 상단 헤더 */}
      <Header
        title={"추천 목록 관리"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            <img
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={22}
            />
          </button>
        }
      />

      {/* 추천 / 제외 선택 버튼 */}
      <SelectTabBar
        tabs={["추천 목록", "제외 목록"]}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      {/* 메인 섹션 */}
      <main
        ref={mainRef}
        className="relative mt-2 flex h-screen w-full flex-col items-center gap-3 overflow-y-auto px-2 scrollbar-hide"
      >
        {/* 검색 창 */}
        <SearchBar
          placeholder="음식명을 검색하세요."
          inputValue={searchTerm}
          setInputValue={setSearchTerm}
          onSearch={handleSearch}
          suggestionList={suggestionList}
        />

        {/* 초성 필터 버튼 */}
        <section>
          <div className="grid h-[61px] w-[340px] grid-flow-dense grid-cols-7 rounded-2xl border-2 border-black bg-white px-7 py-2">
            {filteredChoSeong.map((item, index) => (
              <button
                key={index}
                onClick={() =>
                  setSelectedAlphabetIndex((prev) =>
                    prev === index ? undefined : index,
                  )
                }
                className={`rounded-full text-[15px] text-grey-darker hover:bg-grey-lightActive active:bg-grey-normalActive ${
                  selectedAlphabetIndex === index
                    ? "bg-[#d4f0ff] font-black"
                    : "font-normal"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* 필터링된 음식 리스트 */}
        <section className="grid grid-cols-3 gap-4">
          {loading ? (
            // 간단한 로딩 스켈레톤
            Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-28 w-28 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
              />
            ))
          ) : error ? (
            <div className="col-span-3 w-full py-10 text-center text-red-600">
              {error}
            </div>
          ) : filteredFoodList.length === 0 ? (
            <div className="col-span-3 w-full py-10 text-center text-gray-500">
              항목이 없습니다.
            </div>
          ) : (
            filteredFoodList.map((item, index) => (
              <FoodBox
                key={item.id ?? `${item.title}-${index}`}
                title={item.title}
                imageUrl={item.imageUrl}
                isExcluded={item.isExcluded}
                onToggle={() => onToggle(item)}
                onClick={() => {}}
              />
            ))
          )}
        </section>

        {/* Floating Action Button - 맨 위로 이동 */}
        <FloatingActionButton
          onClick={scrollToTop}
          className="bottom-4 right-4 z-50"
        />
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

      {/* 토스트 알림 */}
      {showToast && (
        <Toast message={toastMessage} show={showToast} className="bottom-40" />
      )}
    </>
  );
}
