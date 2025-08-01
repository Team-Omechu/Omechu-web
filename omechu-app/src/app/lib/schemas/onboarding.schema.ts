import { z } from "zod";

// 온보딩 - 프로필 설정 스키마
export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상 12자 이하로 입력해주세요.")
    .max(12, "닉네임은 2자 이상 12자 이하로 입력해주세요."),
  profileImage: z.string().optional(), // 프로필 이미지는 선택 사항
});

// 온보딩 - 성별 선택 스키마
export const genderSchema = z.object({
  gender: z.enum(["남성", "여성"], {
    errorMap: () => ({ message: "성별을 선택해주세요." }),
  }),
});

// 스키마로부터 TypeScript 타입 추론
export type ProfileFormValues = z.infer<typeof profileSchema>;
export type GenderFormValues = z.infer<typeof genderSchema>;
