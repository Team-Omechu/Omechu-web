"use client";

import { updateProfile } from "@/mypage/api/updateProfile";
import { buildCompletePayloadFromStore } from "@/mypage/mappers/profilePayload";
import { QueryClient } from "@tanstack/react-query";

type Profile = { email?: string | null } | null | undefined;

export async function resetBasicStateAndSync(
  profile: Profile,
  queryClient: QueryClient,
  userKey: string | number | undefined,
) {
  // 서버 초기화 페이로드: 닉네임/프로필이미지는 mapper가 기존값 유지
  const snap = {
    gender: null,
    exercise: null,
    prefer: [],
    bodyType: null,
    allergy: [],
  } as any;

  const payload = buildCompletePayloadFromStore(snap, profile as any);
  const fullPayload = { email: (profile as any)?.email, ...payload } as any;

  await updateProfile(fullPayload);
  await queryClient
    .invalidateQueries({ queryKey: ["profile", userKey], exact: true })
    .catch(() => {});
}
