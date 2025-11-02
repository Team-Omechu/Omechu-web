// TODO: [FSD 마이그레이션] 이 파일은 삭제해도 됩니다.
// 새 위치: src/app/(routes)/(auth)/forgot-password/sent/page.tsx

"use client";

import EmailSentMessage from "./components/EmailSentMessage";

export default function FindPasswordEmailSentPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <EmailSentMessage />
    </main>
  );
}
