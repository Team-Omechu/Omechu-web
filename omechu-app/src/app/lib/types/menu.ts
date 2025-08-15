export interface Menu {
  name: string;
  image_link: string | null;
}

export interface MenuDetail {
  name: string;
  description: string;
  calory: number;
  carbo: number;
  protein: number;
  fat: number;
  sodium: number;
  vitamin: number;
  allergic: string;
  image_link: string | null;
  recipe_link: string | null;
  recipe_link_source: string | null;
  recipe_video_name: string | null;
}
