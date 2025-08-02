"use client";
interface Props {
  nickname: string;
  onChange: (v: string) => void;
  isValid: boolean;
}

export default function NicknameInput({ nickname, onChange, isValid }: Props) {
  return (
    <div className="flex flex-col items-start gap-1 mb-8">
      <div className="ml-1 text-lg font-medium text-grey-darker">닉네임</div>
      <div className="relative">
        <input
          className="h-9 w-44 rounded-md border-[1px] border-grey-darkHover px-2.5 py-2.5 text-base text-grey-darker placeholder:text-sm"
          type="text"
          value={nickname}
          onChange={(e) => onChange(e.target.value)}
          placeholder="닉네임을 입력해주세요"
        />
        <button className="absolute right-2 top-2" onClick={() => onChange("")}>
          <img src={"/x/cancel.svg"} alt={"초기화"} width={20} height={15} />
        </button>
      </div>
      <span
        className={`ml-1 mt-0.5 text-xs font-normal ${isValid ? "text-grey-normalActive" : "text-primary-normalActive"}`}
      >
        한영문자 2-12글자로 입력해주세요
      </span>
    </div>
  );
}
