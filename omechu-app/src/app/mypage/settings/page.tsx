"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import Header from "@/app/components/common/Header";

const termsList: { id: number; title: string; url: string }[] = [
  { id: 1, title: "계정 관리", url: "/mypage/settings/account-settings" },
  { id: 2, title: "이용 약관", url: "/mypage/settings/terms" },
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
              router.push("./");
            }}
          >
            <Image
              src={"/arrow/left-header-arrow.svg"}
              alt={"changeProfileImage"}
              width={22}
              height={30}
            />
          </button>
        }
      />
      <main className="px-2 py-2">
        <ul className="flex flex-col">
          {termsList.map((item) => (
            <li
              key={item.id}
              className="flex w-full flex-col px-6 py-3 hover:bg-[#dfc0e6] active:bg-[#c6aacc]"
            >
              <button
                onClick={() => router.push(`${item.url}`)}
                className="flex w-full items-center justify-between"
              >
                <span className="text-[clamp(1.25rem)] font-normal">
                  {item.title}
                </span>
                <div>
                  <Image
                    src={"/right_arrow_black.png"}
                    alt={"오른쪽 이동 버튼"}
                    width={9}
                    height={15}
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
