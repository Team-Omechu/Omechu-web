import Image from "next/image";

interface RestaurantImageCarouselProps {
  images: string[];
}

export default function RestaurantImageCarousel({
  images,
}: RestaurantImageCarouselProps) {
  return (
    <div className="flex w-full gap-3 overflow-x-auto px-4 py-2">
      {images.map((url, idx) => (
        <Image
          key={idx}
          src={url}
          alt={`맛집 사진 ${idx + 1}`}
          width={180}
          height={180}
          className="shrink-0 rounded-lg"
        />
      ))}
    </div>
  );
}
