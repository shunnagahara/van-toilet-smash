// src/repository/supabase/location.ts
import { supabase } from './index';
import type { Location, LocationImage } from '@/types/location';

interface LocalizedInfo {
  language: string;
  name: string;
  description: string;
}

type LocalizedInfoRecord = Record<'ja' | 'en', LocalizedInfo>;

interface RawLocation {
  id: number;
  latitude: number;
  longitude: number;
  rating: number | null;
  is_open: boolean;
  images: LocationImage[];
  localized_info: LocalizedInfo[];
}

interface RawLocationData {
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
}

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select<string, RawLocationData>(`
        id,
        latitude,
        longitude,
        rating,
        is_open,
        images (
          id,
          url,
          created_at
        ),
        localized_info (
          language,
          name,
          description
        )
      `);

    if (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }

    if (!locations) {
      return [];
    }

    return locations.map((location: RawLocationData) => {
      const jaInfo = location.localized_info?.find(info => info.language === 'ja');
      const enInfo = location.localized_info?.find(info => info.language === 'en');

      return {
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        rating: location.rating ?? undefined,
        isOpen: location.is_open,
        images: location.images || [],
        ja: {
          name: jaInfo?.name || '',
          description: jaInfo?.description || ''
        },
        en: {
          name: enInfo?.name || '',
          description: enInfo?.description || ''
        }
      };
    });
  } catch (error) {
    console.error('Unexpected error in fetchLocations:', error);
    throw error;
  }
};


export const fetchLocationById = async (id: number): Promise<Location | null> => {
  try {
    const { data: location, error } = await supabase
      .from('locations')
      .select<string, RawLocation>(`
        id,
        latitude,
        longitude,
        rating,
        is_open,
        images (
          id,
          url,
          created_at
        ),
        localized_info (
          language,
          name,
          description
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!location) {
      return null;
    }

    const localizedInfo = location.localized_info.reduce<LocalizedInfoRecord>((acc, info) => {
      if (info.language === 'ja' || info.language === 'en') {
        acc[info.language] = info;
      }
      return acc;
    }, { ja: { language: 'ja', name: '', description: '' }, en: { language: 'en', name: '', description: '' } });

    return {
      id: location.id,
      latitude: location.latitude,
      longitude: location.longitude,
      rating: location.rating ?? undefined,
      isOpen: location.is_open,
      images: location.images || [],
      ja: {
        name: localizedInfo.ja.name,
        description: localizedInfo.ja.description
      },
      en: {
        name: localizedInfo.en.name,
        description: localizedInfo.en.description
      }
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    throw error;
  }
};