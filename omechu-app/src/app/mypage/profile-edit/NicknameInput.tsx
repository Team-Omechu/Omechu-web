/* eslint-disable @next/next/no-img-element */
"use client";
interface Props {
  nickname: string;
  onChange: (v: string) => void;
  isValid: boolean;
}

export default function NicknameInput({ nickname, onChange, isValid }: Props) {
  return (
    <div className="mb-8 flex flex-col items-start gap-1">
      <div className="text-grey-darker ml-1 text-lg font-medium">닉네임</div>
      <div className="relative">
        <input
          className="border-grey-dark-hover text-grey-darker h-9 w-44 rounded-md border px-2.5 py-2.5 text-base placeholder:text-sm"
          type="text"
          value={nickname}
          onChange={(e) => onChange(e.target.value)}
          placeholder="닉네임을 입력해주세요"
        />
        <button className="absolute top-2 right-2" onClick={() => onChange("")}>
          <img src={"/x/cancel.svg"} alt={"초기화"} width={20} height={15} />
        </button>
      </div>
      <span
        className={`mt-0.5 ml-1 text-xs font-normal ${isValid ? "text-grey-normal-active" : "text-primary-normal-active"}`}
      >
        한영문자 2-12글자로 입력해주세요
      </span>
    </div>
  );
}
