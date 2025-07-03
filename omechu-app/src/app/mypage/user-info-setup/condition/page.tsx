"use client";
import ProgressBar from "@/app/components/common/ProgressBar";
import { useRouter } from "next/navigation";
import { userInfoStepMap } from "@/app/constants/stepMap";

export default function SetupCondition() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-auto h-screen">
      <ProgressBar stepMap={userInfoStepMap} />
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <section>
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            체질은 무엇인가요?
          </div>
        </section>
        <section className="w-full px-8">
          {/* flex 버전 */}
          <div className="flex flex-col gap-5">
            <button className="w-full h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-lg text-[#FB4746]">
              감기에 잘 걸리는 편이에요
            </button>
            <button className="w-full h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-lg text-[#FB4746]">
              소화가 잘 안되는 날이 많아요
            </button>
            <button className="w-full h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-lg text-[#FB4746]">
              열이 많아서 더위를 잘 타요
            </button>
            <button className="w-full h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-lg text-[#FB4746]">
              추위를 잘 타고 몸이 쉽게 차가워져요
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
              router.push("./food");
            }}
            className="ml-5 text-base text-[#828282] flex items-center"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./allergy");
            }}
            className="mr-5 text-base text-[#828282] flex items-center"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./allergy");
          }}
          className="p-2 min-w-full h-12 text-white text-xl font-normal rounded-t-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
