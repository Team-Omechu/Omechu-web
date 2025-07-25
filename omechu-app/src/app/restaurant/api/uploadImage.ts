import axios from "axios";

export const getPresignedUrl = async (directory: string) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/image/upload?directory=${directory}`,
  );
  return response.data as { uploadUrl: string; fileUrl: string };
};

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const { uploadUrl, fileUrl } = await getPresignedUrl("famousRestaurant");
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  return fileUrl;
};
