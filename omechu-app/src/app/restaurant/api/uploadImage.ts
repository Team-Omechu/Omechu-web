import axiosInstance from "@/lib/api/axios";
import axios from "axios";

// Presigned URL 요청 (서버 API → 토큰 인증 필요)
export const getPresignedUrl = async (directory: string) => {
  const response = await axiosInstance.post(
    `/image/upload?directory=${directory}`,
  );
  return response.data as { uploadUrl: string; fileUrl: string };
};

// 파일을 S3에 업로드
export const uploadImageToS3 = async (file: File): Promise<string> => {
  const { uploadUrl, fileUrl } = await getPresignedUrl("famousRestaurant");

  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return fileUrl;
};
