import apiClient from "@/lib/api/client";

interface PresignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

/**
 * 이미지 업로드를 위한 Presigned URL을 요청하는 API 함수
 * @param directory - S3에 저장될 디렉토리 (e.g., 'profile', 'restaurant')
 */
export const getPresignedUrl = async (
  directory: "profile" | "restaurant",
): Promise<PresignedUrlResponse> => {
  const response = await apiClient.post(`/image/upload?directory=${directory}`);
  // image.uploader.js는 success 래퍼를 사용하지 않으므로, data를 바로 반환합니다.
  return response.data;
};

/**
 * Presigned URL을 사용해 이미지를 S3에 업로드하는 함수
 * @param uploadUrl - S3로부터 받은 Presigned URL
 * @param file - 업로드할 파일
 */
export const uploadImageToS3 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("S3 이미지 업로드에 실패했습니다.");
  }
};
