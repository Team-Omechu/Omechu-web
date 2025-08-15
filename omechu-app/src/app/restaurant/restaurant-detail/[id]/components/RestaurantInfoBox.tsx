"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type AddressObject = {
  road: string;
  jibun: string;
  postalCode: string;
};

interface Props {
  restaurant: {
    id: number;
    name: string;
    googlePlaceId?: string | null;
    category?: string;
    timetable: { days_of_the_week: string; time: string }[];
    address: string | AddressObject;
  };
  showAddress: boolean;
  onToggleAddress: () => void;
}

export default function RestaurantInfoBox({
  restaurant,
  showAddress,
  onToggleAddress,
}: Props) {
  const router = useRouter();

  const addr: AddressObject =
    typeof restaurant.address === "string"
      ? { road: restaurant.address ?? "", jibun: "", postalCode: "" }
      : (restaurant.address ?? { road: "", jibun: "", postalCode: "" });

  return (
    <section className="relative flex w-full flex-col items-center gap-3 rounded-md border-[1px] border-grey-darkHover bg-white p-4">
      {/* 카테고리 */}
      <div className="flex w-full items-center justify-start gap-3">
        <Image src="/menu/menu.svg" alt="맛집 메뉴" width={24} height={24} />
        <span className="mt-1 text-lg font-bold text-gray-700">
          {restaurant.name}
        </span>
      </div>
      <div className="h-[1px] w-full bg-[#3d2828] opacity-60"></div>

      {/* 시간표 */}
      <div className="flex w-full flex-row justify-start gap-5">
        <Image
          src="/clock/clock.svg"
          alt="시간표"
          width={24}
          height={24}
          className="object-contain"
        />
        <div>
          {restaurant.timetable.map((item, index) => (
            <div key={index} className="flex items-center gap-5">
              <h1 className="text-lg text-[#393939]">
                {item.days_of_the_week}
              </h1>
              <span className="text-base text-[#828282]">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#828282] opacity-60"></div>

      {/* 주소 */}
      <div className="flex items-start gap-3">
        <Image
          src="/location/location.svg"
          alt="위치"
          width={32}
          height={32}
          className="object-contain"
        />
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-start gap-1">
            <span className="w-14 text-sm font-bold text-[#393939]">
              도로명
            </span>
            <span className="text-sm text-[#828282]">{addr.road}</span>
          </div>
          {showAddress && (
            <>
              <div className="flex items-start gap-1">
                <span className="w-14 text-sm font-bold text-[#393939]">
                  지번
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[#828282]">{addr.jibun}</span>
                  <span className="text-sm text-[#828282]">
                    우편번호 {addr.postalCode}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
        <button onClick={onToggleAddress}>
          <Image
            src={showAddress ? "/arrow/arrow_up.png" : "/arrow/arrow_down.png"}
            alt="상세주소 보기"
            width={30}
            height={30}
          />
        </button>
      </div>

      {/* 지도보기 버튼 */}
      <div className="flex w-full justify-end">
        <button
          onClick={() =>
            router.push(`/restaurant/restaurant-detail/${restaurant.id}/map`)
          }
          className="flex h-6 w-16 items-center justify-center rounded-3xl bg-[#1F9BDA]"
        >
          <span className="mt-1 text-sm text-white">지도보기</span>
        </button>
      </div>
    </section>
  );
}
