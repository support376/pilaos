export type Studio = {
  kakao_place_id: string;
  place_name: string;
  category_name: string | null;
  phone: string | null;
  road_address_name: string | null;
  address_name: string | null;
  sido: string | null;
  sigungu: string | null;
  lng: number;
  lat: number;
  place_url: string | null;

  naver_url: string | null;

  homepage_url: string | null;
  instagram_handle: string | null;
  naver_blog_handle: string | null;
  kakao_channel_name: string | null;
  kakao_channel_url: string | null;

  kakao_review_count: number | null;
  kakao_review_score: number | null;
  kakao_photo_count: number | null;
  blog_review_count: number | null;
  menu_count: number | null;
  menu_price_min: number | null;
  menu_price_max: number | null;
  has_coupon: number | null;
};

export type ScoreBreakdown = {
  total: number;
  grade: "A" | "B" | "C" | "D" | "F";
  platform: {
    naver: number;
    kakao: number;
    kakao_channel: number;
    total: number;
  };
  digital: {
    homepage: number;
    instagram: number;
    naver_blog: number;
    total: number;
  };
  content: {
    kakao_review: number;
    blog_review: number;
    menu: number;
    total: number;
  };
  missing: string[];
  strong: string[];
};
