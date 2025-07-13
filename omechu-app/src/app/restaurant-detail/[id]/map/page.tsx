"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/common/Header";
import { restaurantList } from "@/app/constant/restaurant/restaurantList";

export default function MapPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number((params as { id: string }).id);

  const restaurant = restaurantList.find((r) => r.id === id);
  if (!restaurant) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p className="text-gray-500">존재하지 않는 맛집입니다.</p>
      </main>
    );
  }

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
        <h1 className="mb-5 text-[#1F9BDA] text-2xl font-bold">
          {restaurant.name} ♥︎
        </h1>
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
