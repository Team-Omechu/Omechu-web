import apiClient from "@/lib/api/client";

// presigned URL 받기
export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const { data } = await apiClient.post("/image/upload?directory=profile", {
    fileName,
    fileType,
  });
  return data;
};

// S3로 업로드
export const uploadToS3 = async (uploadUrl: string, file: File) => {
  await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "x-amz-acl": "public-read",
    },
    body: file,
  });
};

// 프로필 정보 PATCH
export const updateProfile = async (body: {
  nickname: string;
  profileImageUrl?: string;
}) => {
  const userId = "1";
  return apiClient.patch(`/test/profile/${userId}`, body);
};
