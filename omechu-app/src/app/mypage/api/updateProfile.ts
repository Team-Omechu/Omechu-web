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
  fileUrl: string; // 최종 공개 URL
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
  // 현재 스웨거 기준: body 없이 query로 directory만 요구
  const { data } = await axiosInstance.post("/image/upload", null, {
    params: { directory: "profile" },
    headers: authHeader(),
  });

  // 백엔드가 공통 응답 껍질을 쓰는 경우/안 쓰는 경우 둘 다 처리
  const payload: any =
    data && (data as any).success ? (data as any).success : data;

  if (!payload?.uploadUrl || !payload?.fileUrl) {
    throw new Error((data as any)?.error?.reason ?? "업로드 URL 발급 실패");
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      console.log("[getPresignedUrl] raw:", data);
      console.log("[getPresignedUrl] parsed:", payload);
    } catch {}
  }

  return {
    uploadUrl: payload.uploadUrl as string,
    fileUrl: payload.fileUrl as string,
  };
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

  // presigned URL에 x-amz-acl=public-read 쿼리가 포함되어 있으면
  // PUT 요청에도 동일 헤더를 붙여 서명 일치를 보장
  const mustAcl =
    /(?:\?|&)x-amz-acl=public-read/i.test(uploadUrl) ||
    /(?:\?|&)X-Amz-SignedHeaders=[^&]*x-amz-acl/i.test(uploadUrl);

  if (mustAcl) {
    headers["x-amz-acl"] = "public-read";
  } else if (options?.acl) {
    // 옵션으로 명시된 경우에도 붙여줌(단, presign과 불일치하면 S3가 거부함)
    headers["x-amz-acl"] = options.acl;
  }

  if (process.env.NODE_ENV !== "production") {
    try {
      // 과도한 로그 방지: 핵심만
      console.log("[uploadToS3] url has acl?", mustAcl, "headers:", headers);
    } catch {}
  }

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
  const { uploadUrl, fileUrl } = await getPresignedUrl(file.name, file.type);
  await uploadToS3(uploadUrl, file);
  return fileUrl;
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
