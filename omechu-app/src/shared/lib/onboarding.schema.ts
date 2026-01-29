import { z } from "zod";

export const profileSchema = z.object({
  nickname: z
    .string()
    .min(2, "닉네임은 2자 이상 12자 이하로 입력해주세요.")
    .max(12, "닉네임은 2자 이상 12자 이하로 입력해주세요."),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
