import { EmailSentMessage } from "@/widgets/auth";

export default function PasswordResetEmailSentPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <EmailSentMessage />
    </div>
  );
}
