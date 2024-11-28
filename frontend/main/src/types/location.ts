export interface LocationImage {
  id: string;
  url: string;
  createdAt: string;
}

interface LocalizedContent {
  name: string;
  description: string;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  rating?: number;
  isOpen?: boolean;
  images?: LocationImage[];
  ja: LocalizedContent;
  en: LocalizedContent;
}