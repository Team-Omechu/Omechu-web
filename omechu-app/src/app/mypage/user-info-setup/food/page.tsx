"use client";
import Header from "@/app/components/common/Header";
import { useRouter } from "next/navigation";

export default function SetupFood() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-auto h-screen">
      <Header title={"progress-bar"} />
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <section>
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            평소 자주 먹거나 좋아하는{"\n"}
            음식이 있나요?
          </div>
        </section>
        <section>
          {/* flex 버전 */}
          <div className="flex flex-col gap-5">
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              한식
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              양식
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              중식
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              일식
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              다른 나라 음식
            </button>
          </div>
          {/* Grid 버전 */}
          {/* <div className="grid grid-cols-2 gap-x-5 gap-y-3">
            <button className="w-36 h-14 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              한식
            </button>
            <button className="w-36 h-14 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              양식
            </button>
            <button className="w-36 h-14 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              중식
            </button>
            <button className="w-36 h-14 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              일식
            </button>
            <button className="w-36 h-14 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              다른 나라 음식
            </button>
          </div> */}
        </section>
      </main>
      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./state");
            }}
            className="ml-5 text-base text-[#828282] flex items-center"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./condition");
            }}
            className="mr-5 text-base text-[#828282] flex items-center"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./condition");
          }}
          className="p-2 min-w-full h-12 text-white text-xl font-normal rounded-t-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
