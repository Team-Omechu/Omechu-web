"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getReviewsPage } from "@/restaurant/restaurant-detail/[id]/api/review";
import ReviewList from "./ReviewList";
import { useState } from "react";

export default function ReviewInfiniteList({ restId }: { restId: number }) {
  // ✅ 좋아요/투표 상태 로컬 관리
  const [votedReviewIds, setVotedReviewIds] = useState<number[]>([]);
  const [localVotes, setLocalVotes] = useState<Record<number, number>>({});
  const [activeOptionId, setActiveOptionId] = useState<number | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["reviews", restId],
      queryFn: ({ pageParam = 0 }) => getReviewsPage(restId, pageParam, 8),
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.nextCursor : undefined,
      initialPageParam: 0,
    });

  // 모든 리뷰 합치기
  const allReviews = data?.pages.flatMap((page) => page.reviews) ?? [];

  return (
    <div>
      <ReviewList
        restId={restId}
        reviews={allReviews}
        votedReviewIds={votedReviewIds}
        setVotedReviewIds={setVotedReviewIds}
        localVotes={localVotes}
        setLocalVotes={setLocalVotes}
        activeOptionId={activeOptionId}
        setActiveOptionId={setActiveOptionId}
        onReport={() => {
          // TODO: 신고 로직 넣기
          alert("신고하기");
        }}
      />

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 w-full rounded bg-gray-100 py-2"
        >
          {isFetchingNextPage ? "불러오는 중..." : "더보기"}
        </button>
      )}
    </div>
  );
}
