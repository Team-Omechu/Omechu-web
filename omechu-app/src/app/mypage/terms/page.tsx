"use client";

import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import Image from "next/image";

const termsList: { id: number; title: string; url: string }[] = [
  { id: 1, title: "서비스 이용약관", url: "./terms/service" },
  { id: 2, title: "개인정보 처리방침", url: "./terms/personal-info" },
  { id: 3, title: "위치 기반 서비스 이용약관", url: "./terms/location-info" },
];

export default function Terms() {
  const router = useRouter();

  return (
    <>
      <Header
        title={"이용 약관"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage/settings");
            }}
          >
            {"<"}
          </button>
        }
      />
      <main className="px-2 py-2">
        <ul className="flex flex-col">
          {termsList.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`${item.url}`)}
              className="hover:bg-[#dfc0e6] active:bg-[#c6aacc]"
            >
              <li className="flex items-center justify-between w-full px-6 py-3">
                <h1 className="text-[clamp(1.25rem)] font-normal">
                  {item.title}
                </h1>
                <div>
                  <Image
                    src={"/right_arrow_black.png"}
                    alt={"오른쪽 이동 버튼"}
                    width={9}
                    height={15}
                  />
                </div>
              </li>
            </button>
          ))}
        </ul>
      </main>
    </>
  );
}
