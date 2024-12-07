// src/repository/supabase/waitlist.ts
import { supabase } from './index';
import { WaitlistEntry, WaitlistResponse } from '@/types/waitlist';
import { handleTryCatch } from '@/utils/errorHandling';

export const addToWaitlist = async (locationId: number): Promise<WaitlistResponse> => {
  const temporaryUserId = `user_${Math.random().toString(36).substring(2, 9)}`;
  
  const response = await handleTryCatch(async () => {
    const { data, error } = await supabase
      .from('toilet_smash_waitlist')
      .insert([
        {
          location_id: locationId,
          user_id: temporaryUserId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as WaitlistEntry;
  });

  return { ...response, userId: temporaryUserId };
};