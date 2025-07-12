import { z } from "zod";

// 로그인 폼 검증 스키마
export const loginSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
  rememberMe: z.boolean().optional(),
});

// 회원가입 폼 검증 스키마
export const signupSchema = z
  .object({
    email: z.string().email("올바른 이메일 형식이 아닙니다."),
    password: z
      .string()
      .min(8, "비밀번호는 8자 이상이어야 합니다.")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "영문, 숫자, 특수문자를 모두 포함해야 합니다."
      ),
    passwordConfirm: z.string(),
    termsService: z.boolean().refine((val) => val === true, {
      message: "서비스 이용약관에 동의해주세요.",
    }),
    termsPrivacy: z.boolean().refine((val) => val === true, {
      message: "개인정보 처리방침에 동의해주세요.",
    }),
    termsLocation: z.boolean().refine((val) => val === true, {
      message: "위치기반 서비스 이용약관에 동의해주세요.",
    }),
    termsAge: z.boolean().refine((val) => val === true, {
      message: "만 14세 이상인지 확인해주세요.",
    }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

// 비밀번호 찾기 폼 검증 스키마
export const findPasswordSchema = z.object({
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

// 스키마로부터 TypeScript 타입 추론
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type FindPasswordFormValues = z.infer<typeof findPasswordSchema>;
