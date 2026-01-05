import { Button } from "@/shared_FSD/ui/button/Button";

export default function ButtonTestPage() {
  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-body-4-medium">Button</h2>

      <Button>로그인</Button>
      <Button disabled>로그인</Button>
      <div className="flex w-full justify-end gap-2">
        <Button width="sm">인증번호 확인</Button>
        <Button width="sm" disabled>
          인증번호 확인
        </Button>
      </div>
      <div className="flex gap-2">
        <Button width="md" fontColor="black" bgColor="white">
          다시 추천
        </Button>
        <Button width="md">선택하기</Button>
      </div>
    </div>
  );
}
