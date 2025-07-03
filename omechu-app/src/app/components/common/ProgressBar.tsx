import { usePathname } from "next/navigation";

type ProgressBarProps = {
  stepMap: { [key: string]: number };
}; // 키(문자열) : 값(숫자) 를 요소로 갖는 객체를 props 로 받음

export default function ProgressBar({ stepMap }: ProgressBarProps) {
  const pathname = usePathname();
  const currentStep = stepMap[pathname] || 0;
  const totalSteps = Object.values(stepMap).length;

  return (
    <div className="flex flex-col w-full px-5">
      <div className="flex gap-1.5 pt-4 pb-3">
        {[...Array(totalSteps)].map((_, index) => (
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
  );
}
