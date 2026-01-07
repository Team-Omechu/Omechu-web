import Image from "next/image";

import { RoundButton } from "@/shared/ui/button/RoundButton";
import TermsContent from "@/components/settings/TermsContent";
import type { TermsItem } from "@/components/settings/types";

interface TermsModalProps {
  title: string;
  terms: TermsItem[];
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 약관 동의 모달
 * - 회원가입 시 약관 내용을 모달로 표시
 * - TermsContent 공통 컴포넌트 사용
 */
export default function TermsModal({
  title,
  terms,
  onConfirm,
  onClose,
}: TermsModalProps) {
  return (
    <div className="flex max-h-[80vh] w-[335px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-grey-darker">{title}</h2>
        <button onClick={onClose} aria-label="닫기">
          <Image src="/x/black_x_icon.svg" alt="닫기" width={17} height={17} />
        </button>
      </div>

      {/* 약관 내용 스크롤 영역 */}
      <div className="grow overflow-y-auto rounded-md border bg-gray-50 p-3 text-grey-darker [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-secondary-normal [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
        <TermsContent data={terms} textSize="sm" />
      </div>

      {/* 동의 안내 문구 */}
      <div className="mb-2 text-center text-sm text-grey-normal-active">
        위의 내용을 모두 확인했으며 <br /> 이에 동의합니다.
      </div>

      {/* 확인 버튼 */}
      <div className="flex justify-center">
        <RoundButton
          variant="red"
          size="md"
          onClick={onConfirm}
          className="px-12"
        >
          확인
        </RoundButton>
      </div>
    </div>
  );
}
