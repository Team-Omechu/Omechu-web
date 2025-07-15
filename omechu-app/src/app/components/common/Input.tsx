// ---------------------------------------------------------
// [공용 컴포넌트] Input 사용법 //** 밑에 사용 예시
// ---------------------------------------------------------
//* label: 인풋 상단에 표시될 라벨 텍스트 (필수)
//* value: 인풋 값 상태 (필수)
//* onChange: 인풋 값이 변경될 때 실행할 함수 (필수)
//
//* type: 인풋 타입 (기본값: "text")
// - "text" | "password" | "email"
// * - password로 설정하면 눈 아이콘 표시됨
//
// placeholder: 인풋 placeholder 텍스트 (선택)
// showButton: 오른쪽에 버튼 표시 여부 (기본값: true)
// buttonText: 버튼 안에 들어갈 텍스트
// disabled: 버튼 비활성화 여부 (기본값: true)
// description: 인풋 하단 설명 텍스트
// errorMessage: 에러 메시지 텍스트
// showError: 에러 메시지 보여줄지 여부
//
//* onClick: 버튼 클릭 시 실행할 함수
//* onBlur: 인풋에서 포커스 빠질 때 실행할 함수
//* onKeyDown: 인풋에서 키 입력 시 실행할 함수
//
// 버튼 순서나 스타일은 고정이며,
// 버튼은 오른쪽 끝에 위치함

"use client";

import Image from "next/image";
import { useState } from "react";

interface InputProps {
  label: string;
  value: string;
  type?: "text" | "password" | "email"; // 기본은 text, password / 비밀번호면 eye 아이콘 표시됨
  placeholder?: string;
  showButton?: boolean; // 버튼 보여줄지 말지 (기본은 true)
  buttonText?: string; // 버튼 안에 들어갈 텍스트
  successMessage?: string; // 성공 메세지
  errorMessage?: string; // 에러 났을 때 보여줄 문구
  showError?: boolean | null; // 에러 메시지 보여줄지 말지
  description?: string; // input 아래 설명 텍스트
  disabled?: boolean; // 버튼 비활성화 여부 (기본은 true)
  onClick?: () => void; // 버튼 클릭 이벤트
  onChange: (
    value: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => void; // 인풋 값 바뀔 때
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  value,
  type = "text",
  placeholder = "",
  showButton = false,
  buttonText,
  successMessage,
  errorMessage,
  showError = false,
  description = "",
  disabled = true,
  onClick,
  onChange,
  onBlur,
  onKeyDown,
}: InputProps) {
  // input 고유 ID 만들기 (label 기준으로)
  const inputId = `input-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const [isVisible, setIsVisible] = useState(false); // 비밀번호 보기 toggle 상태

  const isPassword = type === "password"; // 비밀번호 input인지 체크
  const inputType = isPassword ? (isVisible ? "text" : "password") : type; // 보기 여부에 따라 type 바뀜

  // 내부 핸들러: 문자열 콜백 또는 이벤트 콜백 모두 지원
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value, e);
  };

  return (
    <section className="relative flex flex-col w-full mb-5">
      {/* 라벨 */}
      <label
        htmlFor={inputId}
        className="text-sm text-normal text-[#393939] ml-0.5 mb-0.5"
      >
        {label}
      </label>
      <div className="flex items-center h-10 gap-1">
        {/* 텍스트 인풋 */}
        <input
          id={inputId}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`w-full h-full pl-4 pt-0.5
            text-sm text-[#393939] font-normal
            border-[1px] border-[#626262] rounded-md
            placeholder:text-sm placeholder:text-[#828282]`}
        />

        {/* 버튼: showButton이 true일 때만 렌더링 */}
        {showButton && (
          <button
            disabled={disabled}
            onClick={onClick}
            className={`flex-shrink-0 px-4 pt-1 w-fit h-full 
              text-center text-xs text-white rounded-lg
              ${
                disabled
                  ? "bg-[#a3a3a3]" // 비활성화 상태
                  : "bg-[#1F9BDA] hover:bg-[#1c8cc4] active:bg-[#197cae]" // 활성 상태
              }`}
          >
            {buttonText}
          </button>
        )}
      </div>
      {/* 비밀번호 보기 아이콘: type이 password일 때만 */}
      {isPassword && (
        <Image
          className={`absolute top-7 ${showButton ? "right-12" : "right-3"}`}
          onClick={() => setIsVisible((prev) => !prev)}
          src={
            isVisible
              ? "/components/common/eye_open.svg" // 비밀번호 보이는 상태
              : "/components/common/eye_closed.svg" // 가려진 상태
          }
          alt="비밀번호 보기 토글"
          width={24}
          height={24}
        />
      )}
      {/* 설명 텍스트 */}
      {description && (
        <span className="mt-1 ml-1 text-sm font-normal text-[#828282]">
          {description}
        </span>
      )}

      {!showError && successMessage && (
        <span className="absolute ml-1 text-xs font-normal text-[#1F9BDA] -bottom-5">
          {successMessage}
        </span>
      )}
      {/* 에러 메시지 */}
      {showError && errorMessage && (
        <span className="absolute ml-1 text-xs font-normal text-red-500 -bottom-5">
          {errorMessage}
        </span>
      )}
    </section>
  );
}

// ---------------------------------------------------------
// [공용 컴포넌트] Input 사용 예시 (타입별 케이스)
// 다른 팀원이 참고할 수 있도록 상태랑 함수 정의까지 포함!
// ---------------------------------------------------------

//* import { useState } from "react";
//* import Input from "@/components/common/Input"; // 경로는 프로젝트 구조에 맞게 바꿔야 함

// ----------------------------------
//* 상태 및 검증 함수 정의
// ----------------------------------
//* 이름 상태
// const [name, setName] = useState("");

//* 이름 제출 함수
// const handleNameSubmit = () => {
//   if (name.trim() === "") {
//     alert("이름을 입력해주세요.");
//     return;
//   }
//   console.log("이름:", name);
// };

//* 이름 입력용
// <Input
//   label="이름"
//   value={name}
//   placeholder="이름을 입력하세요"
//   buttonText="확인"
//   disabled={name.length === 0}
//   onChange={(v) => setName(v)}
//   onClick={handleNameSubmit}
// />

// --------------------------------
//* 이메일 상태 + 에러 상태
// const [email, setEmail] = useState("");
// const [emailError, setEmailError] = useState(false);

//* 이메일 제출 함수
// const handleEmailSubmit = () => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   if (!emailRegex.test(email)) {
//     setEmailError(true);
//     return;
//   }

//   setEmailError(false);
//   console.log("이메일:", email);
// };

//* 2. 이메일 입력용
//  <Input
//    label="이메일"
//    type="email"
//    value={email}
//    placeholder="이메일을 입력하세요"
//    buttonText="다음"
//    disabled={email.length === 0}
//    onChange={(v) => setEmail(v)}
//    onClick={handleEmailSubmit}
//    description="가입에 사용할 이메일을 입력하세요"
//    showError={emailError}
//    errorMessage="이메일 형식이 올바르지 않습니다."
//  />

// ---------------------------------------------------

//* 비밀번호 상태 + 에러 상태
// const [password, setPassword] = useState("");
// const [passwordError, setPasswordError] = useState(false);

//* 비밀번호 제출 함수
// const handlePasswordSubmit = () => {
//   const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=\[{\]};:'",.<>/?\\|`~\-]).{8,}$/;

//   if (!passwordRegex.test(password)) {
//     setPasswordError(true);
//     return;
//   }

//   setPasswordError(false);
//   console.log("비밀번호:", password);
// };

//*  3. 비밀번호 입력용 (대소문자+숫자+특수문자 포함 8자 이상)
//  <Input
//    label="비밀번호"
//    type="password"
//    value={password}
//    placeholder="비밀번호를 입력하세요"
//    buttonText="다음"
//    disabled={password.length < 8}
//    onChange={(v) => setPassword(v)}
//    onClick={handlePasswordSubmit}
//    description="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
//    showError={passwordError}
//    errorMessage="비밀번호 형식이 올바르지 않습니다."
//  />

// ---------------------------------

//* 닉네임 상태
// const [nickname, setNickname] = useState("");

//* 버튼 없는 단독 인풋 (예: 닉네임 상태)
//   <Input
//     label="닉네임"
//     value={nickname}
//     placeholder="닉네임을 입력하세요"
//     showButton={false}
//     onChange={(v) => setNickname(v)}
//   />
// </>
