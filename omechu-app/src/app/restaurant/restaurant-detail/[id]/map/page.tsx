"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import { Restaurants } from "@/app/constant/restaurant/restaurantList";

export default function MapPage() {
  const router = useRouter();

  // URL의 [id] 동적 라우팅 파라미터 가져오기 (예: /restaurant-detail/1/map)
  const params = useParams();

  // 문자열로 들어온 id를 숫자로 변환
  const id = Number((params as { id: string }).id);

  // id에 해당하는 맛집 데이터 찾기
  const restaurant = Restaurants.find((r) => r.id === id);

  // 해당 id의 맛집이 없을 경우 예외 처리 (간단한 메시지)
  if (!restaurant) {
    return (
      <main className="flex h-screen items-center justify-center">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

  // 임시로 사용 중인 지도 이미지 (추후 동적으로 처리 예정이면 여기에 조건문 넣기)
  const mapImagePath = "/restaurant/오레노라멘합정.png";

  return (
    <>
      <Header
        className="border-none"
        title=""
        leftChild={
          <button onClick={() => router.back()}>
            <Image
              src={"/header_left_arrow.png"}
              alt="뒤로가기"
              width={22}
              height={30}
            />
          </button>
        }
      />

      <main className="flex h-full w-full flex-col items-center">
        {/* 맛집 이름 */}
        <h1 className="mb-5 text-2xl font-bold text-[#1F9BDA]">
          {restaurant.name}
        </h1>

        {/* 지도 이미지 영역 */}
        <section className="flex w-full items-center justify-center">
          <div className="h-80 w-80 overflow-hidden border-2 border-[#89d8ff]">
            <Image
              src={mapImagePath}
              alt={`${restaurant.name} 지도`}
              width={330}
              height={330}
            />
          </div>
        </section>
      </main>
    </>
  );
}
