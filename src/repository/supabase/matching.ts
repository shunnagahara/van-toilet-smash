import { supabase } from './index';
import { MatchingEntry, MatchingResponse } from '@/types/matching';

export const checkForMatch = async (userId: string): Promise<MatchingResponse> => {
  try {
    const { data: existingMatch, error: matchError } = await supabase
      .from('toilet_smash_matching')
      .select('*')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .maybeSingle();

    if (matchError) {
      return { data: null, error: new Error(matchError.message) };
    }

    if (existingMatch) {
      return { data: existingMatch as MatchingEntry, error: null };
    }

    return { data: null, error: null };
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
          console.log('Match relevant to user:', userId);
          onMatch(matching);
        }
      }
    );

  channel.subscribe((status) => {
    console.log('Subscription status:', status);
  });

  return channel;
};

export const cancelMatching = async (userId: string) => {
  try {
    const { error } = await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .eq('user_id', userId);

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error occurred');
    return { error };
  }
};