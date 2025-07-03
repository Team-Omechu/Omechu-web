"use client";

import ProgressBar from "@/app/components/common/ProgressBar";
import { useRouter } from "next/navigation";
import { userInfoStepMap } from "@/app/constants/stepMap";

export default function SetupState() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-auto h-screen">
      <ProgressBar stepMap={userInfoStepMap} />
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <section>
          <div className="px-10 text-3xl font-medium leading-relaxed text-center whitespace-pre">
            지금 어떤 운동 상태에{"\n"}
            가까운가요?
          </div>
        </section>
        <section>
          <div className="flex flex-col gap-5">
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              다이어트 중
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              증량 중
            </button>
            <button className="w-60 h-12 p-2 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              유지 중
            </button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <div className="flex justify-between">
          <button
            onClick={() => {
              router.push("./gender");
            }}
            className="ml-5 text-base text-[#828282] flex items-center"
          >
            {"<"} 이전으로
          </button>
          <button
            onClick={() => {
              router.push("./food");
            }}
            className="mr-5 text-base text-[#828282] flex items-center"
          >
            건너뛰기 {">"}
          </button>
        </div>
        <button
          onClick={() => {
            router.push("./food");
          }}
          className="p-2 min-w-full h-12 text-white text-xl font-normal rounded-t-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
