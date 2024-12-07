// src/repository/supabase/location.ts
import { supabase } from './index';
import type { RawLocationData } from '@/types/location';
import { handleTryCatch } from '@/utils/errorHandling';

export const fetchLocations = async () => {
  return handleTryCatch(async () => {
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
  });
};