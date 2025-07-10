import Image from "next/image";

type ReviewProps = {
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
    <section
      className="w-full h-fit p-4 flex flex-col gap-2 bg-white 
                border-[1px] border-[#393939] rounded-xl "
    >
      {/* 프로필사진, 닉네임, 작성일 | 추천 버튼, 설정버튼 */}
      <div className="relative flex justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={profileImgUrl}
            alt={profileImgUrl}
            width={30}
            height={30}
          />
          <span className="text-base text-[#393939] font-semibold">
            {userId}
          </span>
          <span className="mt-[1.2px] text-sm text-[#828282] font-normal">
            {createdDate}
          </span>
        </div>
        <div className="absolute flex items-center gap-1 mb-2 -top-1 -right-1">
          <span className="mt-1 text-sm ">{votes}</span>
          <button onClick={onVote} className="mb-1">
            <Image
              src={isVoted ? "/thumbs-up-fill.png" : "/thumbs-up.png"}
              alt="리뷰 추천 버튼"
              width={22}
              height={22}
            />
          </button>
          <button onClick={onClick}>
            <Image
              src="/menu_dots_vertical.png"
              alt="메뉴"
              width={18}
              height={18}
            />
          </button>
        </div>
        {isOptionOpen && (
          <div className="absolute p-2 bg-white border rounded shadow -right-1 top-6">
            <button
              onClick={onReport}
              className="flex items-center justify-center w-full gap-2 text-left"
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
      <div className="flex flex-col gap-1 mt-1 ml-2">
        <span className="text-xl font-normal text-[#1F9BDA]">
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </span>
        <span className="text-xl font-normal text-[#828282]">{content}</span>
        <div className="flex flex-shrink-0 gap-2 mt-1 overflow-x-scroll scrollbar-hide scroll-smooth max-h-52">
          {images?.map((item, index) => (
            <Image
              key={`review-img-${index}`}
              src={item}
              alt={`후기 이미지 ${index + 1}`}
              width={200}
              height={200}
              className="rounded-md shrink-0"
            />
          ))}
        </div>
      </div>
      {/* 후기 관련 태그 */}
      <div className="flex flex-wrap justify-start gap-1 px-1">
        {tags?.map((item, tagIdx) => (
          <div
            key={`tag-${id}-${tagIdx}`}
            className="px-3 pt-1 pb-0.5 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-nomal hover:scale-105 duration-300"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
