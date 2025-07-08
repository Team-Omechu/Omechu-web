"use client";

import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";
import Image from "next/image";

const settingsList: { id: number; title: string; url: string }[] = [
  { id: 1, title: "계정 관리", url: "/mypage/settings/account-settings" },
  { id: 2, title: "이용 약관", url: "/mypage/terms" },
];

export default function Settings() {
  const router = useRouter();

  return (
    <>
      <Header
        title={"설정"}
        leftChild={
          <button
            onClick={() => {
              router.push("/mypage");
            }}
          >
            <Image
              src={"/left_arrow.png"}
              alt={"이전페이지"}
              width={25}
              height={25}
            />
          </button>
        }
      />
      <main className="px-2 py-2">
        <ul className="flex flex-col">
          {settingsList.map((item) => (
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
