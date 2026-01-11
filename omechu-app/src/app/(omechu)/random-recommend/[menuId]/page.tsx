"use client";

import Image from "next/image";
import {
  useRouter,
  useParams,
  useSearchParams,
  usePathname,
} from "next/navigation";
import { useEffect, useState } from "react";

import {
  Header,
  MenuInfo,
  RestaurantCard,
  SkeletonUIFoodBox,
  Toast,
  type MenuDetail,
} from "@/shared";
import { Restaurant, useGetRestaurants } from "@/entities/restaurant";
import { usePostMukburim } from "@/entities/mukburim";
import { useGetMenuDetail } from "@/entities/menu";
// TODO: FoodCardEx가 widgets/shared에 없음 - 추가 필요

export default function MenuDetailPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showToast, setShowToast] = useState(false);

  const { data, isLoading } = useGetRestaurants();
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
      // 이미 처리한 메뉴면 토스트/뮤테이트 둘 다 스킵하고 URL만 정리
      cleanQuery();
      return;
    }

    // 새로고침 중복 방지: 먼저 “처리 중” 마킹 + URL 즉시 정리
    cleanQuery();

    mutate(decodeMenuId, {
      onSuccess: () => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
        sessionStorage.setItem(key, "done");
      },
      onError: () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodeMenuId, shouldRecord]); // searchParams 객체 자체는 deps에서 제외

  return (
    <div className="flex w-full flex-col">
      <Header
        leftChild={
          <button
            onClick={() => router.push("/mainpage")}
            className="flex items-center font-bold"
          >
            <Image
              src="/arrow/left-header-arrow.svg"
              alt="back"
              width={22}
              height={30}
            />
            <span className="mb-0.5 ml-1 flex shrink-0">처음으로</span>
          </button>
        }
        className="h-[60px] border-b-0"
      />

      <div className="mt-4 flex-col items-center justify-center gap-4 p-4">
        <p className="text-secondary-normal text-center font-semibold">
          {detailMenu?.name}
        </p>
        <Image
          src={detailMenu?.image_link || "/image/image_empty.svg"}
          alt={detailMenu?.name || "메뉴 이미지"}
          className="mx-auto h-24 w-24 rounded-sm"
          width={96}
          height={96}
        />
      </div>

      <div className="mt-10 w-full p-4">
        <MenuInfo MenuItem={detailMenu} />
      </div>

      <div className="mx-4 mt-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">취향 저격! 추천 맛집</h3>
        <button
          className="text-grey-normal-active px-4 text-sm"
          onClick={() =>
            router.push(
              `/restaurant?query=${encodeURIComponent(detailMenu?.name || "")}`,
            )
          }
        >
          더보기 &gt;
        </button>
      </div>

      <div className="mt-3 space-y-2 px-4">
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonUIFoodBox key={i} />
            ))}
          </div>
        )}
        {restaurants.map((item) => (
          <RestaurantCard
            key={item.id}
            name={item.displayName}
            category={detailMenu?.name || ""}
            distance="1.5km"
            address={item.formattedAddress}
            price="0"
            onCardClick={() =>
              router.push(`/restaurant/restaurant-detail/${item.id2}`)
            }
          />
        ))}
      </div>

      <Toast
        message="먹부림 기록에 등록되었습니다."
        show={showToast}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    </div>
  );
}
