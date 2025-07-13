import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/common/Header";
import { restaurantList } from "@/app/constant/restaurant/restaurantList";

export default async function MapPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const restaurant = restaurantList.find((r) => r.id === id);

  if (!restaurant) return notFound();

  const mapImagePath = "/restaurant/오레노라멘합정.png";

  return (
    <>
      <Header
        className="border-none"
        title=""
        leftChild={
          <button onClick={() => history.back()}>
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
