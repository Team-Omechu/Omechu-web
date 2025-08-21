"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useLogoutMutation } from "@/lib/hooks/useAuth";
import SquareButton from "@/components/common/button/SquareButton";
import Toast from "@/components/common/Toast";

export default function LogoutTestPage() {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogoutMutation();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        triggerToast("로그아웃 되었습니다.");
        setTimeout(() => router.replace("/sign-in"), 1000); // 토스트 메시지가 보일 시간을 줌
      },
      onError: (error) => {
        triggerToast(`로그아웃 실패: ${error.message}`);
      },
    });
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-4">
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
      <Toast message={toastMessage} show={showToast} className="bottom-20" />
    </div>
  );
}
