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
  attackPower: number;
  defensePower: number;
  cleanlinessLevel: number;
  locationLevel: number;
  crowdingLevel: number;
  toiletCountLevel: number;
  uniquenessLevel: number;
}

export interface RawLocationData {
  id: number;
  latitude: number;
  longitude: number;
  rating: number | null;
  is_open: boolean;
  images: LocationImage[];
  localized_info: {
    language: string;
    name: string;
    description: string;
  }[];
  attack_power: number;
  defense_power: number;
  cleanliness_level: number;
  location_level: number;
  crowding_level: number;
  toilet_count_level: number;
  uniqueness_level: number;
}
