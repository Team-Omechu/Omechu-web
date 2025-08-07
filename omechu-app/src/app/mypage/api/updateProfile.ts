import axiosInstance from "./axios";

// presigned URL 받기
export const getPresignedUrl = async (fileName: string, fileType: string) => {
  const { data } = await axiosInstance.post("/image/upload?directory=profile", {
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
  return axiosInstance.patch(`/profile`, body);
};
