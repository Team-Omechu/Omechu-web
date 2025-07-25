"use client";

import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/auth/hooks/useAuth";
import SquareButton from "@/components/common/button/SquareButton";

export default function LogoutTestPage() {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        alert("로그아웃 되었습니다.");
        router.replace("/sign-in");
      },
      onError: (error) => {
        alert(`로그아웃 실패: ${error.message}`);
      },
    });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-xl">로그아웃 테스트 페이지</h1>
      <p>이 버튼을 누르면 로그아웃 후 로그인 페이지로 이동합니다.</p>
      <SquareButton
        variant="red"
        size="lg"
        onClick={handleLogout}
        disabled={isPending}
        className="w-48"
      >
        {isPending ? "로그아웃 중..." : "로그아웃 하기"}
      </SquareButton>
    </div>
  );
}
