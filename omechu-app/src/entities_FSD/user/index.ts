// API
export {
  login,
  signup,
  logout,
  sendVerificationCode,
  verifyVerificationCode,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getCurrentUser,
  ApiClientError,
} from "./api/authApi";
export { fetchProfile } from "./api/profileApi";
export type { ApiResponse, ApiError } from "./api/authApi";

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

// Store
export { useAuthStore } from "./model/auth.store";

// Schemas
export {
  loginSchema,
  signupSchema,
  findPasswordSchema,
  resetPasswordSchema,
} from "./model/auth.schema";

// Types
export type {
  LoginFormValues,
  SignupFormValues,
  FindPasswordFormValues,
  ResetPasswordFormValues,
} from "./model/auth.schema";
export type { ProfileType, UpdateProfileBody } from "./model/profile.types";
export type { LoginTokens, LoginSuccessData } from "./api/authApi";
