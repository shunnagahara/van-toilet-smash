export interface LocationImage {
  id: string;
  url: string;
  created_at: string;
}

interface LocalizedContent {
  name: string;
  description: string;
  address: string;
}

export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  rating: number;
  isOpen: boolean;
  images?: LocationImage[];
  fighterPic: string;
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
  fighter_pic: string;
  localized_info: {
    language: string;
    name: string;
    description: string;
    address: string;
  }[];
  attack_power: number;
  defense_power: number;
  cleanliness_level: number;
  location_level: number;
  crowding_level: number;
  toilet_count_level: number;
  uniqueness_level: number;
}
