// src/repository/supabase/waitlist.ts
import { supabase } from './index';
import { MatchingEntry } from '@/types/matching';
import { WaitlistEntry } from '@/types/waitlist';

export interface WaitlistResponse {
  data: WaitlistEntry | null;
  error: Error | null;
  userId: string;
}

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

export const checkForMatch = async (userId: string) => {
  console.log('Starting checkForMatch for userId:', userId);

  try {
    const { data: myEntry, error: myError } = await supabase
      .from('toilet_smash_waitlist')
      .select('user_id, location_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (myError) {
      return { data: null, error: new Error(myError.message) };
    }

    if (!myEntry) {
      return { data: null, error: null };
    }

    const { data: otherEntry, error: otherError } = await supabase
      .from('toilet_smash_waitlist')
      .select('user_id, location_id')
      .neq('user_id', userId)
      .maybeSingle();

    if (otherError) {
      return { data: null, error: new Error(otherError.message) };
    }

    if (!otherEntry) {
      return { data: null, error: null };
    }

    const { data: matching, error: matchError } = await supabase
      .from('toilet_smash_matching')
      .insert([
        {
          player1_id: myEntry.user_id,
          player2_id: otherEntry.user_id,
          player1_location_id: myEntry.location_id,
          player2_location_id: otherEntry.location_id,
        },
      ])
      .select()
      .single();

    if (matchError) {
      return { data: null, error: new Error(matchError.message) };
    }

    await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .in('user_id', [myEntry.user_id, otherEntry.user_id]);

    return { data: matching as MatchingEntry, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    return { data: null, error };
  }
};

export const subscribeToMatching = (userId: string, onMatch: (matching: MatchingEntry) => void) => {
  console.log('Setting up subscription for:', userId);

  const channel = supabase.channel(`matching_${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'toilet_smash_matching',
      },
      (payload) => {
        console.log('Received matching event:', payload);
        const matching = payload.new as MatchingEntry;
        if (matching.player1_id === userId || matching.player2_id === userId) {
          onMatch(matching);
        }
      }
    );

  channel.subscribe((status) => {
    console.log('Subscription status:', status);
  });

  return channel;
};