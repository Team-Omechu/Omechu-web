interface TextReviewProps {
  comment: string;
  setComment: (text: string) => void;
}

export default function TextReview({ comment, setComment }: TextReviewProps) {
  return (
    <div className="mb-10">
      <p className="mb-3 text-sm text-gray-700">
        솔직하고 <span className="font-extrabold">자세한 후기</span>를
        들려주세요.
      </p>
      <textarea
        className="h-24 w-full resize-none rounded-md border border-grey-darkHover p-2 text-sm"
        placeholder="식당의 맛, 서비스, 위생 등 생생한 경험을 공유해 주세요."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={300}
      />
      <div className="text-right text-xs text-[#888]">
        {comment.length} / 300자
      </div>
    </div>
  );
}
