"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast";
import { BattleModal } from "@/shared/index";

export default function BattleModalTestPage() {
  const [nickname, setNickname] = useState("");

  const [toast, setToast] = useState({
    state: "error" as "error" | "success",
    message: "",
    show: false,
  });

  const handleShare = () => {
    const shareUrl = "https://your-app.com/battle/2314";
    navigator.clipboard.writeText(shareUrl);

    setToast({
      state: "success",
      message: "링크 복사 완료! 친구에게 공유해보세요",
      show: true,
    });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleEnter = () => {
    console.log("배틀방 입장 클릭");
  };

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 p-6">
      <BattleModal
        modalType="createDone"
        battleRoomName="공유 테스트 방"
        roomCode="2314"
        shareUrl=""
        onClose={() => console.log("닫기")}
        onShare={handleShare}
        onEnter={handleEnter}
      />

      <BattleModal
        modalType="enterRoom"
        battleRoomName="방 이름"
        onClose={() => console.log("닫기")}
        onEnter={handleEnter}
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      {toast.show && (
        <Toast state={toast.state} message={toast.message} show={toast.show} />
      )}
    </main>
  );
}
