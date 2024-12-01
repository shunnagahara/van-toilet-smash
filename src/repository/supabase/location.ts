// src/repository/supabase/location.ts
import { supabase } from './index';
import type { Location, LocationImage } from '@/types/location';

interface LocalizedInfo {
  language: string;
  name: string;
  description: string;
}

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
      console.error('Error fetching location:', error);
      throw error;
    }

    if (!location) {
      return null;
    }

    const jaInfo = location.localized_info?.find((info: any) => info.language === 'ja');
    const enInfo = location.localized_info?.find((info: any) => info.language === 'en');

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
  } catch (error) {
    console.error('Unexpected error in fetchLocationById:', error);
    throw error;
  }
};