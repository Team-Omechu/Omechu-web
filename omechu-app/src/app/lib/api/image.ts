import axiosInstance from "@/lib/api/axios";

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  directory: string = "profile",
) => {
  const { data } = await axiosInstance.post(
    `/image/upload?directory=${directory}`,
    {
      fileName,
      fileType,
    },
  );
  return data as { uploadUrl: string; fileUrl: string };
};

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
