"use client";
import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function UserInfoSetup() {
  const router = useRouter();
  return (
    <>
      <Header
        className={"border-b-0"}
        leftChild={<button onClick={() => router.back()}>{"<"}</button>}
      />{" "}
      <main className="flex flex-col items-center gap-5 justify-around w-full px-4 py-6 min-h-[calc(100vh-10rem)]">
        <section>
          <div className="text-lg font-medium">
            {"<"} 이달의 기본 상태 {">"}
          </div>
        </section>
        <section className="flex flex-col gap-3 px-5"></section>
        <section>
          <button
            onClick={() => router.push("/userInfoSetup")}
            className="w-[335px] h-[45px] bg-[#fb4746] hover:bg-[#e2403f] rounded-md active:bg-[#c93938] text-white text-[17px] font-medium"
          >
            시작하기
          </button>
        </section>
      </main>
    </>
  );
}
