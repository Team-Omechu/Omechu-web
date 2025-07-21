"use client";

import Review from "@/restaurant/restaurant-detail/[id]/components/ReviewList/Review";
import type { ReviewProps } from "@/restaurant/restaurant-detail/[id]/components/ReviewList/Review";

interface ReviewListProps {
  reviews: Omit<
    ReviewProps,
    "onVote" | "onReport" | "onClick" | "isOptionOpen" | "isVoted"
  >[]; // 핵심 데이터
  votedReviewIds: number[];
  setVotedReviewIds: React.Dispatch<React.SetStateAction<number[]>>;
  localVotes: Record<number, number>;
  setLocalVotes: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  activeOptionId: number | null;
  setActiveOptionId: React.Dispatch<React.SetStateAction<number | null>>;
  onReport: () => void;
}

export default function ReviewList({
  reviews,
  localVotes,
  votedReviewIds,
  setVotedReviewIds,
  setLocalVotes,
  activeOptionId,
  setActiveOptionId,
  onReport,
}: ReviewListProps) {
  return (
    <div className="flex flex-col gap-4">
      {reviews.map((item) => {
        const currentVotes = localVotes[item.id] ?? item.votes;
        const isVoted = votedReviewIds.includes(item.id);

        return (
          <Review
            key={item.id}
            id={item.id}
            profileImgUrl={item.profileImgUrl}
            userId={item.userId}
            createdDate={item.createdDate}
            votes={currentVotes}
            rating={item.rating}
            content={item.content}
            tags={item.tags}
            images={item.images}
            onVote={() => {
              if (isVoted) {
                setVotedReviewIds((prev) =>
                  prev.filter((id) => id !== item.id),
                );
                setLocalVotes((prev) => ({
                  ...prev,
                  [item.id]: (prev[item.id] ?? item.votes) - 1,
                }));
              } else {
                setVotedReviewIds((prev) => [...prev, item.id]);
                setLocalVotes((prev) => ({
                  ...prev,
                  [item.id]: (prev[item.id] ?? item.votes) + 1,
                }));
              }
            }}
            isVoted={isVoted}
            onReport={onReport}
            onClick={() =>
              setActiveOptionId((prev) => (prev === item.id ? null : item.id))
            }
            isOptionOpen={activeOptionId === item.id}
          />
        );
      })}
    </div>
  );
}
