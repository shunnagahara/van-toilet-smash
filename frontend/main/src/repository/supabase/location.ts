// src/repository/supabase/location.ts
import { supabase } from './index';
import type { Location } from '@/types/location';

export const fetchLocations = async (): Promise<Location[]> => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select(`
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

    return locations.map((location: any) => {
      // 言語ごとのローカライズ情報を抽出
      const jaInfo = location.localized_info?.find((info: any) => info.language === 'ja');
      const enInfo = location.localized_info?.find((info: any) => info.language === 'en');

      return {
        id: location.id,
        latitude: location.latitude,
        longitude: location.longitude,
        rating: location.rating,
        is_open: location.is_open,
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
      .select(`
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
      rating: location.rating,
      is_open: location.is_open,
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