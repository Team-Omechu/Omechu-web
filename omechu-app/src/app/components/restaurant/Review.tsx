import { useState } from "react";
import Image from "next/image";

type ReviewProps = {
  profileImgUrl: string;
  userId: string;
  createdDate: string;
  votes: number;
  rating: number;
  content: string;
  tags?: string[];
  images?: string[];
};

export default function Review({
  profileImgUrl,
  userId,
  createdDate,
  votes = 0,
  rating,
  content,
  tags,
  images,
}: ReviewProps) {
  return (
    <section
      className="w-full h-fit p-4 flex flex-col gap-3 bg-white 
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
          <button className="mb-1">
            <Image
              src="/thumbs-up-fill.png"
              alt="리뷰 추천 버튼"
              width={22}
              height={22}
            />
          </button>
          <button>
            <Image
              src="/menu_dots_vertical.png"
              alt="메뉴"
              width={18}
              height={18}
            />
          </button>
        </div>
      </div>
      {/* 평점, 후기 */}
      <div className="flex flex-col gap-1 ml-2">
        <span className="text-2xl font-normal text-[#1F9BDA]">
          {"★".repeat(rating) + "☆".repeat(5 - rating)}
        </span>
        <span className="text-xl font-normal text-[#828282]">{content}</span>
        <div>
          {images?.map((item, index) => (
            <div
              key={index}
              className="px-3 pt-1 pb-0.5 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-nomal hover:scale-105 duration-300"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      {/* 후기 관련 태그 */}
      <div className="flex flex-wrap justify-start gap-1 px-1">
        {tags?.map((item, index) => (
          <div
            key={index}
            className="px-3 pt-1 pb-0.5 bg-white border-[1px] w-fit rounded-3xl border-[#393939] text-sm font-nomal hover:scale-105 duration-300"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
