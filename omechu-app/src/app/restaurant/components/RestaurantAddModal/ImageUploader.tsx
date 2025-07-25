import { useRef } from "react";

import Image from "next/image";

interface ImageUploaderProps {
  imagePreviewUrl: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

export default function ImageUploader({
  imagePreviewUrl,
  onImageChange,
  onImageRemove,
}: ImageUploaderProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="mb-8 mt-4 flex h-40 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-gray-300 text-sm text-gray-600"
      onClick={() => imageInputRef.current?.click()}
    >
      {imagePreviewUrl ? (
        <div className="relative h-full w-full">
          <Image
            src={imagePreviewUrl}
            alt="업로드 이미지"
            width={358}
            height={160}
            className="object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImageRemove();
            }}
            className="absolute right-2 top-2 rounded-full bg-gray-200 px-1 text-base font-extrabold text-black"
          >
            ×
          </button>
        </div>
      ) : (
        <span>업로드할 이미지 미리보기</span>
      )}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
        onChange={onImageChange}
      />
    </div>
  );
}
