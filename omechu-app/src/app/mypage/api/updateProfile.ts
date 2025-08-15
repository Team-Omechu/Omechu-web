import axiosInstance from "@/lib/api/axios";
import { useAuthStore } from "@/lib/stores/auth.store";

/** 공통 응답 껍질 */
type ApiEnvelope<T> = {
  resultType: "SUCCESS" | "FAIL";
  error?: { reason?: string } | null;
  success?: T | null;
};

type PresignSuccess = {
  uploadUrl: string; // PUT용 URL
  publicUrl: string; // 최종 공개 URL
};

export type UpdateProfilePayload = {
  nickname?: string;
  profileImageUrl?: string | null;
  profileImageDelete?: boolean;
  gender?: string;
  body_type?: string;
  exercise?: string;
  prefer?: string[];
  allergy?: string[];
};

const authHeader = () => {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/** presigned URL 발급 */
export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const { data } = await axiosInstance.post<ApiEnvelope<PresignSuccess>>(
    "/image/upload?directory=profile",
    { fileName, fileType },
    { headers: authHeader() },
  );

  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error(data.error?.reason ?? "업로드 URL 발급 실패");
  }
  return data.success;
};

/** S3 업로드 (PUT) */
export const uploadToS3 = async (
  uploadUrl: string,
  file: File,
  options?: { acl?: "public-read" },
) => {
  const headers: Record<string, string> = {
    "Content-Type": file.type,
  };
  // presign에 ACL이 포함된 경우에만 사용 (서명과 불일치하면 업로드 실패)
  if (options?.acl) headers["x-amz-acl"] = options.acl;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });
  if (!res.ok) {
    throw new Error(`S3 업로드 실패 (${res.status})`);
  }
};

/** 편의 함수: 파일 -> 공개 URL */
export const uploadProfileImage = async (file: File) => {
  const { uploadUrl, publicUrl } = await getPresignedUrl(file.name, file.type);
  await uploadToS3(uploadUrl, file);
  return publicUrl;
};

/** 프로필 업데이트 */
export const updateProfile = async (body: UpdateProfilePayload) => {
  const { data } = await axiosInstance.patch<
    ApiEnvelope<{
      email: string;
      nickname: string;
      profileImageUrl?: string;
      gender?: string;
      body_type?: string;
      exercise?: string;
      prefer?: string[];
      allergy?: string[];
    }>
  >("/profile", body, { headers: authHeader() });

  if (data.resultType !== "SUCCESS" || !data.success) {
    throw new Error(data.error?.reason ?? "프로필 업데이트 실패");
  }
  return data.success;
};
