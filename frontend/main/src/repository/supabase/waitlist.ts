import { supabase } from './index';
import { MatchingEntry } from '@/types/matching';
import { WaitlistEntry } from '@/types/waitlist';

// waitlist.ts
export const addToWaitlist = async (locationId: number): Promise<{ data: WaitlistEntry | null; error: any; userId: string }> => {
  // temporaryUserIdをここで生成
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
      console.error('Error adding to waitlist:', error);
      return { data: null, error, userId: temporaryUserId };
    }

    console.log('Successfully added to waitlist:', data);
    // temporaryUserIdを必ず返す
    return { data, error: null, userId: temporaryUserId };
  } catch (error) {
    console.error('Unexpected error in addToWaitlist:', error);
    // エラーの場合でもtemporaryUserIdを返す
    return { data: null, error, userId: temporaryUserId };
  }
};

export const checkForMatch = async (userId: string) => {
  console.log('Starting checkForMatch for userId:', userId);

  try {
    // 自分の待機情報を取得
    const { data: myEntry, error: myError } = await supabase
      .from('toilet_smash_waitlist')
      .select('user_id, location_id')
      .eq('user_id', userId)
      .maybeSingle();

    if (myError || !myEntry) {
      console.log('No entry found for current user or error:', myError);
      return { data: null, error: myError };
    }

    // 他のプレイヤーを検索
    const { data: otherEntry, error: otherError } = await supabase
      .from('toilet_smash_waitlist')
      .select('user_id, location_id')
      .neq('user_id', userId)
      .maybeSingle();

    if (otherError || !otherEntry) {
      console.log('No other players found or error:', otherError);
      return { data: null, error: otherError };
    }

    // マッチングを作成
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
      console.error('Error creating match:', matchError);
      return { data: null, error: matchError };
    }

    // 待機リストから削除
    await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .in('user_id', [myEntry.user_id, otherEntry.user_id]);

    return { data: matching, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
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