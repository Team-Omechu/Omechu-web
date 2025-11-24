"use client";

import EmailSentMessage from "./components/EmailSentMessage";

export default function FindPasswordEmailSentPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4">
      <EmailSentMessage />
    </main>
  );
}
