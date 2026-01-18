"use client";

import { ProtectedRoute } from "@/app/providers";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
