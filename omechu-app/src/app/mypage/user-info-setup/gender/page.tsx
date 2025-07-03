"use client";
import ProgressBar from "@/app/components/common/ProgressBar";
import { useRouter } from "next/navigation";
import { userInfoStepMap } from "@/app/constants/stepMap";

export default function SetupGender() {
  const router = useRouter();
  return (
    <div className="flex flex-col w-auto h-screen">
      <ProgressBar stepMap={userInfoStepMap} />
      <main className="flex flex-col items-center justify-center flex-1 w-full h-full gap-12">
        <section>
          <div className="text-3xl font-medium">성별은 무엇인가요?</div>
        </section>
        <section>
          <div className="flex gap-5">
            <button className="w-28 h-14 p-2.5 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              여성
            </button>
            <button className="w-28 h-14 p-2.5 bg-white border-[1px] rounded-md border-[#FB4746] active:bg-[#c93938] hover:bg-[#e2403f] hover:text-white text-xl text-[#FB4746]">
              남성
            </button>
          </div>
        </section>
      </main>
      <footer className="flex flex-col items-end w-full pb-[env(safe-area-inset-bottom)] gap-3">
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="mr-5 text-base text-[#828282]"
        >
          건너뛰기 {">"}
        </button>
        <button
          onClick={() => {
            router.push("./state");
          }}
          className="p-2 min-w-full h-12 text-white text-xl font-normal rounded-t-md bg-[#1f9bda] hover:bg-[#1c8cc4] active:bg-[#197cae]"
        >
          다음
        </button>
      </footer>
    </div>
  );
}
