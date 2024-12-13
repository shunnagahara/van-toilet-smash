// src/constants/location.ts
import { Location } from "@/types/location";
import { fetchLocations } from '@/repository/supabase/location';
export { fetchLocations };
export { FALLBACK_LOCATIONS as VANCOUVER_LOCATIONS } from './location';


export const FALLBACK_LOCATIONS: Location[] = [
  {
    id: 1,
    latitude: 49.2827,
    longitude: -123.1067,
    rating: 4.2,
    isOpen: true,
    attackPower: 80,
    defensePower: 70,
    cleanlinessLevel: 85,
    locationLevel: 75,
    crowdingLevel: 60,
    toiletCountLevel: 70,
    uniquenessLevel: 80,
    fighterPic: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-fighter-images/toilet-fighter1.jpg?t=2024-12-13T18%3A03%3A40.322Z",
    images: [
      {
        id: "1",
        url: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/images.jpeg",
        created_at: new Date().toISOString()
      },
      {
        id: "2",
        url: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/8f3e39adc40efd3b6234a7b3ce7c21977447f8e2.jpg",
        created_at: new Date().toISOString()
      },
    ],
    ja: {
      name: "ガスタウン公共トイレ",
      description: "Historic Gastown地区の公衆トイレ。24時間利用可能。",
      address: "323ジャーヴィス・ストリート、バンクーバー、BC V6C 3P8"
    },
    en: {
      name: "Gastown Public Toilet",
      description: "Public restrooms in the Historic Gastown area, available 24 hours a day.",
      address: "323 Jervis St, Vancouver, BC V6C 3P8"
    }
  },
  {
    id: 2,
    latitude: 49.2754,
    longitude: -123.1216,
    rating: 4.5,
    isOpen: true,
    attackPower: 80,
    defensePower: 70,
    cleanlinessLevel: 85,
    locationLevel: 75,
    crowdingLevel: 60,
    toiletCountLevel: 70,
    uniquenessLevel: 80,
    fighterPic: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-fighter-images/toilet-fighter2.jpg?t=2024-12-13T18%3A03%3A30.697Z",
    images: [],
    ja: {
      name: "イエールタウン・コミュニティセンター",
      description: "コミュニティセンター内の清潔なトイレ施設。センター開館時間内であれば誰でも利用可能です。",
      address: "609 ヘルムケン・ストリート、バンクーバー、BC V6B 3M6"
    },
    en: {
      name: "Yaletown Community Center",
      description: "Clean restroom facilities inside the community center. Open to public during center hours.",
      address: "609 Helmcken St, Vancouver, BC V6B 3M6"
    }
  },
  {
    id: 3,
    latitude: 49.2897,
    longitude: -123.1226,
    rating: 3.8,
    isOpen: true,
    attackPower: 80,
    defensePower: 70,
    cleanlinessLevel: 85,
    locationLevel: 75,
    crowdingLevel: 60,
    toiletCountLevel: 70,
    uniquenessLevel: 80,
    fighterPic: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-fighter-images/toilet-fighter3.jpg?t=2024-12-13T18%3A02%3A43.746Z",
    images: [],
    ja: {
      name: "コールハーバー休憩所",
      description: "シーウォール沿いの公共トイレ。観光スポット周辺の便利な場所にあり、きれいに管理されています。",
      address: "461 ハミルトン・ストリート #449, バンクーバー, BC V6B 2P9"
    },
    en: {
      name: "Coal Harbour Rest Area",
      description: "Public restroom along the seawall. Conveniently located near tourist attractions and well-maintained.",
      address: "461 Hamilton St #449, Vancouver, BC V6B 2P9"
    }
  }
];

// APIからロケーション情報を取得する関数
export const getLocations = async (): Promise<Location[]> => {
  try {
    const { data, error } = await fetchLocations();
    if (error) throw error;
    return data as Location[];
  } catch (error) {
    console.warn('Failed to fetch locations, using fallback data:', error);
    return FALLBACK_LOCATIONS;
  }
};