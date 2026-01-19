"use client";

import Image from "next/image";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Header,
  MenuInfo,
  RestaurantCard,
  Toast,
  type MenuDetail,
} from "@/shared";
import { Restaurant, useGetRestaurants } from "@/entities/restaurant";
import { usePostMukburim } from "@/entities/mukburim";
import { useGetMenuDetail } from "@/entities/menu";

export const restaurantMockData = [
  {
    id: 101,
    displayName: "을지로 칼국수집",
    formattedAddress: "서울 중구 을지로 12길 7",
    distance: "0.8km",
    price: "9000",
  },
  {
    id: 102,
    displayName: "연남동 파스타 바",
    formattedAddress: "서울 마포구 연남로 3길 22",
    distance: "1.5km",
    price: "17000",
  },
  {
    id: 103,
    displayName: "성수 수제버거",
    formattedAddress: "서울 성동구 성수이로 20길 45",
    distance: "2.3km",
    price: "13500",
  },
];

export default function MenuDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showToast, setShowToast] = useState(false);

  // ✅ 토스트 타이머 중복 방지
  const toastTimerRef = useRef<number | null>(null);
  const openToast = (ms = 2000) => {
    setShowToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setShowToast(false), ms);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const { data } = useGetRestaurants();
  const { menuId } = useParams();
  const { mutate } = usePostMukburim();

  const decodeMenuId = decodeURIComponent(menuId as string);
  const restaurants: Restaurant[] = Array.isArray(data) ? data : [];
  const { data: menuDetailData } = useGetMenuDetail(decodeMenuId);
  const detailMenu: MenuDetail | undefined = menuDetailData;

  const shouldRecord = searchParams.get("record") === "1";

  // URL에서 record 파라미터 제거
  const cleanQuery = () => {
    const next = new URLSearchParams(searchParams.toString());
    if (next.has("record")) {
      next.delete("record");
      router.replace(next.size ? `${pathname}?${next}` : pathname, {
        scroll: false,
      });
    }
  };

  useEffect(() => {
    if (!decodeMenuId || !shouldRecord) return;

    const key = `mukburim-recorded:${decodeMenuId}`;
    const already = sessionStorage.getItem(key);

    if (already) {
      cleanQuery();
      return;
    }

    cleanQuery();

    mutate(decodeMenuId, {
      onSuccess: () => {
        openToast(2000);
        sessionStorage.setItem(key, "done");
      },
      onError: () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodeMenuId, shouldRecord]);

  // ✅ 공유에 사용할 값들
  const shareTitle = useMemo(() => {
    const name = detailMenu?.name ?? "오늘의 메뉴";
    return `${name} 추천받았어!`;
  }, [detailMenu?.name]);

  const shareText = useMemo(() => {
    const name = detailMenu?.name ?? "오늘의 메뉴";
    return `오늘은 ${name} 어때?`;
  }, [detailMenu?.name]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  // ✅ 공유 로직 (Web Share -> Clipboard fallback)
  const handleShare = async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";

      if (!url) return;

      // ✅ navigator를 never로 좁히지 않게 window.navigator를 로컬 변수로
      const nav = typeof window !== "undefined" ? window.navigator : null;

      // 1) Web Share API
      if (
        nav &&
        typeof (nav as Navigator & { share?: unknown }).share === "function"
      ) {
        await (
          nav as Navigator & {
            share: (data: {
              title?: string;
              text?: string;
              url?: string;
            }) => Promise<void>;
          }
        ).share({
          title: detailMenu?.name ? `${detailMenu.name} 추천!` : "오늘의 메뉴",
          text: detailMenu?.name
            ? `오늘은 ${detailMenu.name} 어때?`
            : "오늘의 메뉴 확인해봐!",
          url,
        });
        return;
      }

      // 2) Clipboard API
      if (
        nav &&
        nav.clipboard &&
        typeof nav.clipboard.writeText === "function"
      ) {
        await nav.clipboard.writeText(url);
        // 토스트/알림
        return;
      }

      // 3) Legacy fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      // 토스트/알림
    } catch {
      alert("공유에 실패했어요. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        title="오늘의 메뉴"
        showBackButton={false}
        showShareButton={true}
        onShareClick={handleShare}
      />

      <div className="mt-4 flex-col items-center justify-center p-4">
        <p className="text-brand-primary mb-3 text-center text-[1.5rem] font-semibold">
          {/* {detailMenu?.name} */} 비빔밥
        </p>
        <Image
          src={detailMenu?.image_link || "/image/image_empty.svg"}
          alt={detailMenu?.name || "메뉴 이미지"}
          className="mx-auto h-24 w-24 rounded-md"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full p-4">
        <MenuInfo MenuItem={detailMenu} />
      </div>

      <div className="mx-4 mt-5 flex items-center justify-between">
        <h3 className="text-[1.125rem] font-semibold whitespace-nowrap">
          취향 저격! 추천 메뉴 있는 맛집
        </h3>
        <button
          className="flex items-center justify-center gap-1 px-4"
          onClick={() =>
            router.push(
              `/restaurant?query=${encodeURIComponent(detailMenu?.name || "")}`,
            )
          }
        >
          <Image
            src={"/map/mage_location-fill.svg"}
            alt="현위치"
            width={20}
            height={20}
            className="h-4 w-4"
          />
          <p className="text-sm whitespace-nowrap text-[5E5E5E]">현위치로</p>
        </button>
      </div>

      <div className="mt-3 ml-2 items-center justify-center space-y-3.5 px-4 pb-6">
        {restaurantMockData.map((item) => (
          <RestaurantCard
            key={item.id}
            name={item.displayName}
            category={detailMenu?.name || ""}
            distance="1.5K"
            address={item.formattedAddress}
            price="0"
            onCardClick={() =>
              router.push(`/restaurant/restaurant-detail/${item.id}`)
            }
          />
        ))}

        <button className="itmes-center mr-2 flex w-full justify-center text-center text-[#A8A8A8]">
          <p>더보기</p>
          <Image
            src={"/arrow/navigate_next.svg"}
            alt="더보기 버튼"
            width={25}
            height={25}
            className="items-center justify-center"
          />
        </button>
      </div>

      <Toast
        message={showToast ? "링크가 복사됐어요." : ""}
        show={showToast}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    </div>
  );
}
