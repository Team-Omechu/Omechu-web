import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상 12자 이하로 입력해주세요.")
    .max(12, "닉네임은 2자 이상 12자 이하로 입력해주세요."),
});

export const genderSchema = z.object({
  gender: z.enum(["female", "male"], {
    message: "성별을 선택해주세요.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type GenderFormValues = z.infer<typeof genderSchema>;
