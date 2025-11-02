import Image from "next/image";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface ImageUploaderProps {
  images: File[];
  setImages: (files: File[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  setImages,
  maxImages = 5,
}: ImageUploaderProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (images.length + files.length > maxImages) return;
    setImages([...images, ...files]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...images];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setImages(reordered);
  };

  return (
    <div className="mb-10">
      <p className="mb-3 text-sm text-gray-700">
        음식, 인테리어, 메뉴판 등의 <span className="font-bold">사진</span>을
        첨부해 주세요. (최대 {maxImages}장)
      </p>
      <div className="flex gap-2 overflow-x-auto rounded-md border border-grey-dark-hover bg-white p-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {images.length < maxImages && (
                  <label className="flex h-[80px] w-[80px] shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed bg-white text-xl text-gray-400">
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <Image
                      src="/restaurant/camera-fill.svg"
                      alt="이미지 업로드"
                      width={40}
                      height={40}
                    />
                  </label>
                )}
                {images.map((file, idx) => (
                  <Draggable
                    key={file.name + idx}
                    draggableId={file.name + idx}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative h-[80px] w-[80px] shrink-0"
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`preview-${idx}`}
                          fill
                          className="rounded-md object-cover"
                        />
                        <button
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== idx))
                          }
                          className="absolute right-0 top-0"
                        >
                          <Image
                            src={"/x/gray_x_icon.svg"}
                            alt="취소 버튼"
                            width={20}
                            height={20}
                            className="object-cover"
                          />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        ※ 사진 순서는 드래그 앤 드롭으로 변경 가능합니다.
      </p>
    </div>
  );
}
