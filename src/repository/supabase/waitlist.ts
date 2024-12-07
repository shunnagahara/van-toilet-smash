// src/repository/supabase/waitlist.ts
import { supabase } from './index';
import { WaitlistEntry, WaitlistResponse } from '@/types/waitlist';

export const addToWaitlist = async (locationId: number): Promise<WaitlistResponse> => {
  const temporaryUserId = `user_${Math.random().toString(36).substring(2, 9)}`;
  console.log('Generated userId:', temporaryUserId);

  try {
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
      return { 
        data: null, 
        error: new Error(error.message), 
        userId: temporaryUserId 
      };
    }

    return { 
      data: data as WaitlistEntry, 
      error: null, 
      userId: temporaryUserId 
    };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    return { data: null, error, userId: temporaryUserId };
  }
};