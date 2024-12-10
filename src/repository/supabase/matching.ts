import { supabase } from './index';
import { MatchingEntry, MatchingResponse } from '@/types/matching';
import { handleTryCatch} from '@/utils/errorHandling';

export const checkForMatch = async (userId: string): Promise<MatchingResponse> => {
  return handleTryCatch(async () => {
    const { data: existingMatch, error: matchError } = await supabase
      .from('toilet_smash_matching')
      .select('*')
      .or('player1_id.eq.' + userId + ',player2_id.eq.' + userId)
      .maybeSingle();

    if (matchError) {
      throw new Error(matchError.message);
    }

    return existingMatch as MatchingEntry;
  });
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
  return handleTryCatch(async () => {
    const { error } = await supabase
      .from('toilet_smash_waitlist')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return null;
  });
};

export const findAndCreateMatch = async (userId: string, locationId: number) => {
  return handleTryCatch(async () => {
    // 待機中の他のプレイヤーを検索
    const { data: waitingPlayer, error: waitError } = await supabase
      .from('toilet_smash_waitlist')
      .select('*')
      .neq('user_id', userId)
      .limit(1)
      .single();

    if (waitError) {
      throw new Error(waitError.message);
    }

    if (waitingPlayer) {
      // マッチング成立時、マッチングテーブルに登録
      const { error: matchError } = await supabase
        .from('toilet_smash_matching')
        .insert([
          {
            player1_id: userId,
            player2_id: waitingPlayer.user_id,
            player1_location_id: locationId,
            player2_location_id: waitingPlayer.location_id
          }
        ]);

      if (matchError) {
        throw new Error(matchError.message);
      }

      // 両プレイヤーを待機リストから削除
      await supabase
        .from('toilet_smash_waitlist')
        .delete()
        .in('user_id', [userId, waitingPlayer.user_id]);
    }

    return null;
  });
};