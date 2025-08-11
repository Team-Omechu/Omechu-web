interface RatingSelectorProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function RatingSelector({
  rating,
  setRating,
}: RatingSelectorProps) {
  return (
    <div className="mb-4">
      <p className="mb-3 text-sm text-gray-700">
        <span className="font-bold">총점</span>을 매겨주세요! 얼마나
        만족하셨나요?*
      </p>
      <div className="flex justify-center gap-1 rounded-md border border-gray-700 bg-white text-2xl text-[#1F9BDA]">
        {[...Array(5)].map((_, i) => (
          <button key={i} onClick={() => setRating(i + 1)}>
            {i < rating ? "★" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}
