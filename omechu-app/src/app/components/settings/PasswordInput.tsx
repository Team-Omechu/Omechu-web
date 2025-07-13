"use client";

import Image from "next/image";
import { useState } from "react";

interface PasswordInputProps {
  label: string; // 인풋 상단 라벨 텍스트
  value: string; // 현재 입력된 값
  placeholder?: string; // placeholder 텍스트
  errorMessage?: string; // 에러 메시지
  onChange: (value: string) => void; // 입력값 변경 핸들러
  showError?: boolean; // 에러 메시지 표시 여부
  testId?: string; // 테스트용 data-testid
  onBlur?: () => void; // blur 이벤트 핸들러
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // 키보드 입력 핸들러
}

export default function PasswordInput({
  label,
  value,
  placeholder = "",
  errorMessage,
  showError = false,
  testId,
  onChange,
  onBlur,
  onKeyDown,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false); // 비밀번호 보기/숨기기 토글

  return (
    <section className="relative flex flex-col w-full gap-1 mb-5">
      <span>{label}</span>
      <input
        data-testid={testId}
        type={isVisible ? "text" : "password"} // 보이기 여부에 따라 type 변경
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full h-10 text-sm text-[#828282] font-normal text-center border-[1px] border-[#626262] rounded-md"
      />
      {/* 비밀번호 보기 아이콘 */}
      <Image
        className="absolute cursor-pointer top-9 right-4 active:bg-gray-200"
        onClick={() => setIsVisible((prev) => !prev)}
        src={isVisible ? "/eye_open.svg" : "/eye_closed.svg"}
        alt="비밀번호 보기 토글"
        width={24}
        height={24}
      />
      {/* 에러 메시지 출력 */}
      {showError && errorMessage && (
        <span className="text-xs font-normal text-red-500">{errorMessage}</span>
      )}
    </section>
  );
}

/**
 **  props 설명 **
 *
 * [필수 props]
 * - label: string → input 위에 붙는 설명 텍스트
 * - value: string → 현재 input 값 (상위에서 상태로 관리해야 함)
 * - onChange: (value: string) => void → 입력값 변경될 때 실행할 함수
 *
 * [선택 props]
 * - placeholder: string → placeholder 텍스트 (기본은 빈 문자열)
 * - errorMessage: string → 에러 발생 시 보여줄 메시지
 * - showError: boolean → 에러 메시지 보여줄지 여부
 * - testId: string → 테스트용 data-testid
 * - onBlur: () => void → input이 포커스 잃었을 때 실행할 함수
 * - onKeyDown: (e) => void → 키보드 입력 받을 때 실행할 함수
 */

//** 사용 예시 **
//   import { useState } from "react";
// import PasswordInput from "@/app/components/settings/PasswordInput";

// export default function SamplePage() {
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(false);

//   return (
//     <div className="p-4">
//       <PasswordInput
//         label="비밀번호"
//         value={password}
//         placeholder="비밀번호를 입력하세요"
//         onChange={(val) => {
//           setPassword(val);
//           setError(false); // 입력 중엔 에러 제거
//         }}
//         onBlur={() => {
//           if (password.length < 8) {
//             setError(true); // 8자 미만이면 에러 표시
//           }
//         }}
//         errorMessage="8자 이상 입력해주세요"
//         showError={error}
//         testId="password-input"
//       />
//     </div>
//   );
// }
