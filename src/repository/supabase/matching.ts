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
  console.log('Adding to waitlist:', { temporaryUserId, locationId });

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
      console.error('Error adding to waitlist:', error);
      return { data: null, error, userId: temporaryUserId };
    }

    console.log('Successfully added to waitlist:', data);
    return { data, error: null, userId: temporaryUserId };
  } catch (error) {
    console.error('Unexpected error in addToWaitlist:', error);
    return { data: null, error, userId: temporaryUserId };
  }
};

export const checkForMatch = async (userId: string) => {
  console.log('Starting checkForMatch for userId:', userId);

  try {
    // まず既存のマッチングをチェック
    const { data: existingMatch } = await supabase
      .from('toilet_smash_matching')
      .select('*')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .maybeSingle();

    if (existingMatch) {
      console.log('Found existing match:', existingMatch);
      return { data: existingMatch, error: null };
    }

    // 自分の待機情報を確認
    const { data: myEntry } = await supabase
      .from('toilet_smash_waitlist')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!myEntry) {
      console.log('User not in waitlist');
      return { data: null, error: null };
    }

    // 他の待機中のプレイヤーを検索
    const { data: otherEntries } = await supabase
      .from('toilet_smash_waitlist')
      .select('*')
      .neq('user_id', userId);

    if (!otherEntries || otherEntries.length === 0) {
      console.log('No other players waiting');
      return { data: null, error: null };
    }

    const opponent = otherEntries[0];
    console.log('Found opponent:', opponent);

    // マッチングレコードを作成
    const { data: newMatch, error: matchError } = await supabase
      .from('toilet_smash_matching')
      .insert([
        {
          player1_id: userId,
          player2_id: opponent.user_id,
          player1_location_id: myEntry.location_id,
          player2_location_id: opponent.location_id,
        },
      ])
      .select()
      .single();

    if (matchError) {
      console.error('Error creating match:', matchError);
      return { data: null, error: matchError };
    }

    console.log('Created new match:', newMatch);

    // マッチングが成功したら両プレイヤーを待機リストから削除
    await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .in('user_id', [userId, opponent.user_id]);

    return { data: newMatch, error: null };
  } catch (error) {
    console.error('Error in checkForMatch:', error);
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
    // 待機リストからユーザーを削除
    const { error } = await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error canceling match:', error);
      throw error;
    }

    return { error: null };
  } catch (error) {
    console.error('Unexpected error in cancelMatching:', error);
    return { error };
  }
};