import Image from "next/image";

export type ReviewProps = {
  id: number;
  profileImgUrl: string;
  userId: string;
  createdDate: string;
  votes: number;
  rating: number;
  content: string;
  tags?: string[];
  images?: string[];
  onClick?: () => void;
  onReport?: () => void;
  onVote?: () => void;
  isVoted: boolean;
  isOptionOpen?: boolean;
};

export default function Review({
  id,
  profileImgUrl,
  userId,
  createdDate,
  votes = 0,
  rating,
  content,
  tags,
  images,
  onClick,
  onReport,
  onVote,
  isVoted,
  isOptionOpen = false,
}: ReviewProps) {
  return (
    <section className="flex h-fit w-full flex-col gap-2 rounded-xl border-[1px] border-[#393939] bg-white p-4">
      {/* 프로필사진, 닉네임, 작성일 | 추천 버튼, 설정버튼 */}
      <div className="relative flex justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={profileImgUrl}
            alt={profileImgUrl}
            width={30}
            height={30}
          />
          <span className="text-base font-semibold text-[#393939]">
            {userId}
          </span>
          <span className="mt-[1.2px] text-sm font-normal text-[#828282]">
            {createdDate}
          </span>
        </div>
        <div className="absolute -right-1 -top-1 mb-2 flex items-center gap-1">
          <span className="text-sm">{votes}</span>
          <button onClick={onVote}>
            <Image
              src={
                isVoted ? "/thumb/thumbs-up-fill.svg" : "/thumb/thumbs-up.svg"
              }
              alt="리뷰 추천 버튼"
              width={18}
              height={18}
              className="mr-1 object-contain"
            />
          </button>
          <button onClick={onClick}>
            <Image
              src="/menu/menu_dots.svg"
              alt="메뉴"
              width={18}
              height={18}
            />
          </button>
        </div>
        {isOptionOpen && (
          <div className="absolute -right-1 top-6 rounded border bg-white p-2 shadow">
            <button
              onClick={onReport}
              className="flex w-full items-center justify-center gap-2 text-left"
            >
              <Image
                src="/report.png"
                alt={"신고하기"}
                width={13}
                height={18}
              />
              <span className="mt-1">신고하기</span>
            </button>
          </div>
        )}
      </div>
      {/* 평점, 후기 */}
      <div className="ml-2 mt-1 flex flex-col gap-1">
        <span className="text-lg font-normal text-[#1F9BDA]">
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </span>
        <span className="text-base font-normal text-[#828282]">{content}</span>
        <div className="mt-1 flex max-h-52 flex-shrink-0 gap-2 overflow-x-scroll scroll-smooth scrollbar-hide">
          {images?.map((item, index) => (
            <Image
              key={`review-img-${index}`}
              src={item}
              alt={`후기 이미지 ${index + 1}`}
              width={200}
              height={200}
              className="shrink-0 rounded-md"
            />
          ))}
        </div>
      </div>
      {/* 후기 관련 태그 */}
      <div className="flex flex-wrap justify-start gap-1 px-1">
        {tags?.map((item, tagIdx) => (
          <div
            key={`tag-${id}-${tagIdx}`}
            className="font-nomal w-fit rounded-3xl border-[1px] border-[#393939] bg-white px-3 pb-0.5 pt-1 text-sm duration-300 hover:scale-105"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
