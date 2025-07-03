import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();

  const stepMap: { [key: string]: number } = {
    "/mypage/user-info-setup/gender": 1,
    "/mypage/user-info-setup/state": 2,
    "/mypage/user-info-setup/food": 3,
    "/mypage/user-info-setup/condition": 4,
    "/mypage/user-info-setup/allergy": 5,
  };

  const currentStep: number = stepMap[pathname] || 0;

  return (
    <>
      <div className="flex flex-col w-full px-5 border-2 border-black">
        <div className="flex gap-1.5 pt-4 pb-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`w-16 h-2 rounded-3xl border-[1.5px] border-[#1F9BDA] ${
                index < currentStep ? "bg-[#1F9BDA]" : "bg-white"
              }`}
            ></div>
          ))}
        </div>
        <div>
          <button className="w-[62px] h-6 p-1 bg-[#1F9BDA] hover:bg-[#1c8cc4] active:bg-[#197cae] flex items-center justify-center text-white text-xs font-light rounded-md">
            그만하기
          </button>
        </div>
      </div>
    </>
  );
}
