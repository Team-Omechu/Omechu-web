export interface ReviewProps {
  id: number;
  rating: number;
  tag: string[];
  content: string;
  createdDate: string;
  votes: number;
  userId: string;
  profileImgUrl: string;
  reviewImg: string[]; // link만 추출
  isVoted: boolean;
}

export interface MostTag {
  restId: string;
  tag: string;
  count: number;
}
