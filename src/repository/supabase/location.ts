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
        attack_power,
        defense_power,
        cleanliness_level,
        location_level,
        crowding_level,
        toilet_count_level,
        uniqueness_level,
        fighter_pic,
        images (
          id,
          url,
          created_at
        ),
        localized_info (
          language,
          name,
          description,
          address
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
        fighterPic: location.fighter_pic,
        attackPower: location.attack_power,
        defensePower: location.defense_power,
        cleanlinessLevel: location.cleanliness_level,
        locationLevel: location.location_level,
        crowdingLevel: location.crowding_level,
        toiletCountLevel: location.toilet_count_level,
        uniquenessLevel: location.uniqueness_level,
        ja: {
          name: jaInfo?.name || '',
          description: jaInfo?.description || '',
          address: jaInfo?.address || ''
        },
        en: {
          name: enInfo?.name || '',
          description: enInfo?.description || '',
          address: enInfo?.address || ''
        }
      };
    });
  });
};