// TODO: FSD 개선 - 도메인 특화 타입은 entities로 이동 권장
// entities/menu/types/menu.types.ts로 이동 고려
export interface Menu {
  name: string;
  image_link: string | null;
}

export interface MenuDetail {
  name: string;
  description: string;
  calory: string;
  carbo: string;
  protein: string;
  fat: string;
  sodium: string;
  vitamin: string[];
  allergic: string[];
  image_link: string | null;
  recipe_link: string | null;
  recipe_link_source: string | null;
  recipe_video_name: string | null;
}
