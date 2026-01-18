import { axiosInstance } from "@/shared/index";

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
