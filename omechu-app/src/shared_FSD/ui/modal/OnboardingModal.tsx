import Image from "next/image";

type OnboardingModalProps = {
  title: string;
  subtitle?: string;
  onInfoClick: () => void;
  onRecommendClick: () => void;
  onClose: () => void;
};

export function OnboardingModal({
  title,
  subtitle,
  onInfoClick,
  onRecommendClick,
  onClose,
}: OnboardingModalProps) {
  return (
    <div className="relative w-[335px] rounded-[20px] bg-white p-5 shadow-xl">
      <button
        onClick={onClose}
        className="absolute top-3 right-3"
        aria-label="모달 닫기"
      >
        <Image
          src="/x/black_x_icon.svg"
          alt="닫기 버튼"
          width={24}
          height={24}
        />
      </button>

      <div className="flex flex-col items-center text-center">
        <h2 className="text-body-3-medium text-font-high mt-6">{title}</h2>
        {subtitle && (
          <p className="text-caption-1-regular text-font-placeholder mt-1">
            {subtitle}
          </p>
        )}
      </div>

      <div className="font-body-4-medium mt-6 flex gap-3">
        <button
          onClick={onInfoClick}
          className="bg-brand-tertiary text-font-medium h-12 w-36 flex-1 rounded-[10px]"
        >
          내 정보 보기
        </button>
        <button
          onClick={onRecommendClick}
          className="bg-brand-primary text-brand-secondary h-12 w-36 flex-1 rounded-[10px]"
        >
          추천 받기
        </button>
      </div>
    </div>
  );
}
