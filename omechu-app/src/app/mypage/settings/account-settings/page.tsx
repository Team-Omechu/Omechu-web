import dynamic from "next/dynamic";

const AccountSettingsClient = dynamic(
  () => import("./AccountSettingsClient"),
  { ssr: false }, // 서버에서 그릴 필요 없으면 꺼도 됨 (선호에 따라 켜도 무방)
);

export default function AccountSettingsPage() {
  return <AccountSettingsClient />;
}
