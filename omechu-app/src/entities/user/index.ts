// ============================================
// entities/user 배럴 export
// FSD 규칙: entities는 shared만 의존 가능
// ============================================

// API
export {
  ApiClientError,
  type ApiResponse,
  type ApiError,
  type LoginSuccessData,
  type LoginTokens,
  type SignupSuccessData,
  type SendVerificationCodeSuccessData,
  type VerifyVerificationCodeSuccessData,
  type RequestPasswordResetSuccessData,
  login,
  signup,
  sendVerificationCode,
  verifyVerificationCode,
  requestPasswordReset,
  resetPassword,
  logout,
  changePassword,
  getCurrentUserWithToken,
  getCurrentUser,
} from "./api/authApi";

export { ProfileApiError, fetchProfile } from "./api/profileApi";

// Hooks
export {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useSendVerificationCodeMutation,
  useVerifyVerificationCodeMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useUserQuery,
} from "./lib/hooks/useAuth";

export { useProfile } from "./lib/hooks/useProfile";

// Constants
export {
  VALID_PROVIDERS,
  PROVIDER_DISPLAY_NAMES,
} from "./lib/constants/oauth.const";

// Model - Schema
export {
  loginSchema,
  type LoginFormValues,
  signupSchema,
  type SignupFormValues,
  findPasswordSchema,
  type FindPasswordFormValues,
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "./model/auth.schema";

// Model - Store
export { useAuthStore } from "./model/auth.store";
export { useUserInfoSetupStore } from "./model/userInfoSetup.store";

// Model - Types
export type { OAuthProvider } from "./model/auth.types";
export type { ProfileType, UpdateProfileBody } from "./model/profile.types";
