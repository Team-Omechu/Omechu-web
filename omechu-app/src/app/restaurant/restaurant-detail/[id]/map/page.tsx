"use client";

// next/navigation 훅들 - 클라이언트에서 라우터 관련 기능 사용
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

// 공통 헤더 컴포넌트
import Header from "@/app/components/common/Header";

// 샘플 데이터 - 맛집 리스트 상수
import { restaurantList } from "@/app/constant/restaurant/restaurantList";

export default function MapPage() {
  const router = useRouter();

  // URL의 [id] 동적 라우팅 파라미터 가져오기 (예: /restaurant-detail/1/map)
  const params = useParams();

  // 문자열로 들어온 id를 숫자로 변환
  const id = Number((params as { id: string }).id);

  // id에 해당하는 맛집 데이터 찾기
  const restaurant = restaurantList.find((r) => r.id === id);

  // 해당 id의 맛집이 없을 경우 예외 처리 (간단한 메시지)
  if (!restaurant) {
    return (
      <main className="flex items-center justify-center h-screen">
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

      <main className="flex flex-col items-center w-full h-full">
        {/* 맛집 이름 */}
        <h1 className="mb-5 text-[#1F9BDA] text-2xl font-bold">
          {restaurant.name}
        </h1>

        {/* 지도 이미지 영역 */}
        <section className="flex items-center justify-center w-full">
          <div className="w-80 h-80 border-2 border-[#89d8ff] overflow-hidden">
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
