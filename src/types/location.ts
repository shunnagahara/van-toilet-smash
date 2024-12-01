export interface LocationImage {
  id: string;
  url: string;
  created_at: string;  // created_atに変更
  createdAt?: string; // 後方互換性のために追加
}

interface LocalizedContent {
  name: string;
  description: string;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  rating?: number;  // rating を追加
  isOpen: boolean;
  images?: LocationImage[];
  ja: LocalizedContent;
  en: LocalizedContent;
}