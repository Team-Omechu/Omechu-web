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
      onError: () => {}, // cleanup function
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodeMenuId, shouldRecord]); // searchParams 객체 자체는 deps에서 제외 //

  return (
    <div className="flex w-full flex-col">
      <Header title="맞춤 추천" showBackButton={false} />

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
        {/* {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonUIFoodBox key={i} />
            ))}
          </div>
        )} */}
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
        {/*api 연동시 enhancement */}
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
        message="먹부림 기록에 등록되었습니다."
        show={showToast}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
      />
    </div>
  );
}
