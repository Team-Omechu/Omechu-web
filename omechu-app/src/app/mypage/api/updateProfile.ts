import { useAuthStore } from "@/lib/stores/auth.store";
import axiosInstance from "@/lib/api/axios";

// presigned URL 받기
export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const { data } = await axiosInstance.post("/image/upload?directory=profile", {
    fileName,
    fileType,
  });
  return data;
};

// S3로 업로드
export const uploadToS3 = async (
  uploadUrl: string,
  file: File,
  options?: { acl?: "public-read" },
) => {
  const headers: Record<string, string> = {
    "Content-Type": file.type,
  };
  if (options?.acl) headers["x-amz-acl"] = options.acl;
  await fetch(uploadUrl, {
    method: "PUT",
    headers,
    body: file,
  });
};

// 프로필 정보 PATCH
export const updateProfile = async (body: {
  nickname: string;
  profileImageUrl?: string;
}) => {
  const accessToken = useAuthStore.getState().accessToken;

  return axiosInstance.patch(`/profile`, body, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
};
