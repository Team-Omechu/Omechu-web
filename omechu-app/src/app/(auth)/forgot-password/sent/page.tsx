"use client";

import { useRouter } from "next/navigation";

import { Header } from "@/shared";
import { EmailSentMessage } from "@/widgets/auth";

export default function PasswordResetEmailSentPage() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col bg-background-primary">
      <Header onLeftClick={() => router.back()} />

      <div className="flex flex-1 flex-col items-center justify-center">
        <EmailSentMessage />
      </div>
    </main>
  );
}
