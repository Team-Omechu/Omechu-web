"use client";
import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function UserInfoSetup() {
  const router = useRouter();
  return (
    <>
      <Header
        className={"border-[#CAC6BF]"}
        leftChild={<button onClick={() => router.back()}>{"<"}</button>}
      />{" "}
      <main className="flex flex-col items-center justify-center w-full gap-24 px-4 py-6 min-h-[calc(100vh-10rem)]">
        <section className="flex flex-col gap-5 text-center">
          <div className="text-2xl font-medium">기본 정보 입력하기</div>
          <span className="whitespace-pre font-normal text-[#828282]">
            기본정보를 저장하여 {"\n"} 더 정교한 메뉴 추천을 받아보세요!
          </span>
          {/* prettier formatOnSave 때문에 whitespace-pre 미적용 -> 추후 수정 */}
        </section>
        <section>
          <button
            onClick={() => router.push("user-info-setup/gender")}
            className="w-48 h-16 p-5 bg-[#fb4746] hover:bg-[#e2403f] rounded-md active:bg-[#c93938] text-white text-2xl flex items-center justify-center font-medium"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
