import { Button } from "@/shared_FSD/ui/button/Button";

export default function ButtonTestPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h2 className="text-body-4-medium">Button</h2>

      <Button>기본 버튼</Button>
      <Button disabled>비활성 기본 버튼</Button>
      <Button width="verify">인증번호 확인</Button>
      <Button width="verify" disabled>
        인증번호 확인
      </Button>
    </div>
  );
}
