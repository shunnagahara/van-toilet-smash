export interface LocationImage {
  id: string;
  url: string;
  created_at: string;  // created_atに変更
}

interface LocalizedContent {
  name: string;
  description: string;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  is_open: boolean;    // isOpenからis_openに変更
  images?: LocationImage[];
  ja: LocalizedContent;
  en: LocalizedContent;
}