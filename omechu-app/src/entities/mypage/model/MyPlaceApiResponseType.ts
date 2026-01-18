export type MyPlaceApiResponseType = {
  id: string | number;
  name?: string;
  rest_image?: string;
  address?: string;
  rating?: number;
  repre_menu?: { menu: string }[];
  _count?: { review: number };
};
