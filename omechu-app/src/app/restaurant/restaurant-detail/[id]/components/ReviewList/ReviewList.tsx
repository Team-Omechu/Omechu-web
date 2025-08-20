"use client";

import Review from "@/restaurant/restaurant-detail/[id]/components/ReviewList/Review";
import type { ReviewProps } from "@/restaurant/restaurant-detail/[id]/components/ReviewList/Review";
import { setReviewLike } from "@/restaurant/restaurant-detail/[id]/api/review";
import { useEffect, useState } from "react";

interface ReviewListProps {
  restId: number;
  reviews: ReviewProps[]; // ✅ 단순화: 이제 ReviewProps 그대로 받음
  votedReviewIds: number[];
  setVotedReviewIds: React.Dispatch<React.SetStateAction<number[]>>;
  localVotes: Record<number, number>;
  setLocalVotes: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  activeOptionId: number | null;
  setActiveOptionId: React.Dispatch<React.SetStateAction<number | null>>;
  onReport: () => void;
}

export default function ReviewList({
  restId,
  reviews,
  localVotes,
  votedReviewIds,
  setVotedReviewIds,
  setLocalVotes,
  activeOptionId,
  setActiveOptionId,
  onReport,
}: ReviewListProps) {
  const [pending, setPending] = useState<Record<number, boolean>>({});
  const [likedById, setLikedById] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLikedById((prev) => {
      const next = { ...prev };
      for (const r of reviews) {
        if (next[r.id] === undefined) {
          next[r.id] = votedReviewIds.includes(r.id);
        }
      }
      return next;
    });
  }, [reviews, votedReviewIds]);

  const setLikedState = (reviewId: number, isLiked: boolean) => {
    setLikedById((m) => ({ ...m, [reviewId]: isLiked }));
    setVotedReviewIds((ids) =>
      isLiked
        ? Array.from(new Set([...ids, reviewId]))
        : ids.filter((id) => id !== reviewId),
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((item) => {
        const currentVotes = localVotes[item.id] ?? item.votes;
        const isVoted = likedById[item.id] ?? false;
        const isPending = !!pending[item.id];

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
            images={item.images} // ✅ 이름 맞춤
            isVoted={isVoted} // ✅ props에서 받음
            onVote={async () => {
              if (isPending) return;

              const prevVoted = isVoted;
              const prevVotes = currentVotes;
              const nextVoted = !prevVoted;

              setPending((p) => ({ ...p, [item.id]: true }));

              // 1) 옵티미스틱 반영
              setLikedState(item.id, nextVoted);
              setLocalVotes((v) => ({
                ...v,
                [item.id]: (v[item.id] ?? item.votes) + (nextVoted ? 1 : -1),
              }));

              try {
                // 2) 서버 반영
                const { likeCount, isLiked } = await setReviewLike(
                  restId,
                  item.id,
                  nextVoted,
                );

                // 3) 서버 확정
                const safeCount = likeCount ?? prevVotes + (nextVoted ? 1 : -1);
                const safeVoted = isLiked ?? nextVoted;

                setLocalVotes((v) => ({ ...v, [item.id]: safeCount }));
                setLikedState(item.id, safeVoted);
              } catch (e) {
                // 4) 롤백
                setLocalVotes((v) => ({ ...v, [item.id]: prevVotes }));
                setLikedState(item.id, prevVoted);
                console.error("리뷰 좋아요 실패:", e);
              } finally {
                setPending((p) => ({ ...p, [item.id]: false }));
              }
            }}
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
