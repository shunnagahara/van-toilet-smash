import { supabase } from './index';
import { MatchingEntry, MatchingResponse } from '@/types/matching';
import { handleTryCatch } from '@/utils/errorHandling';
import { calculateBattleResult } from '@/utils/battle';
import { VANCOUVER_LOCATIONS } from '@/constants/location';

export const findAndCreateMatch = async (userId: string, locationId: number) => {
  return handleTryCatch(async () => {
    const { data: waitingPlayer, error: waitError } = await supabase
      .from('toilet_smash_waitlist')
      .select('*')
      .neq('user_id', userId)
      .limit(1)
      .maybeSingle();

    if (waitError) {
      console.error('Wait list query error:', waitError);
      throw new Error(waitError.message);
    }

    if (waitingPlayer) {
      // プレイヤーの位置情報を取得
      const player1Location = VANCOUVER_LOCATIONS.find(loc => loc.id === locationId);
      const player2Location = VANCOUVER_LOCATIONS.find(loc => loc.id === waitingPlayer.location_id);

      if (!player1Location || !player2Location) {
        throw new Error('Location not found');
      }

      // バトル結果を計算
      const battleResult = calculateBattleResult({
        player1Location,
        player2Location
      });
      // マッチング成立時、マッチングテーブルに登録
      const { data: matchData, error: matchError } = await supabase
        .from('toilet_smash_matching')
        .insert([
          {
            player1_id: userId,
            player2_id: waitingPlayer.user_id,
            player1_location_id: locationId,
            player2_location_id: waitingPlayer.location_id,
            player1_result: battleResult.player1Result,
            player2_result: battleResult.player2Result
          }
        ])
        .select()
        .single();

      if (matchError) {
        console.error('Match creation error:', matchError);
        throw new Error(matchError.message);
      }

      // 両プレイヤーを待機リストから削除
      const { error: deleteError } = await supabase
        .from('toilet_smash_waitlist')
        .delete()
        .in('user_id', [userId, waitingPlayer.user_id]);

      if (deleteError) {
        console.error('Waitlist deletion error:', deleteError);
        // エラーをログに記録するが、マッチングは既に成立しているのでスロー不要
      }

      return matchData;
    }

    return null;
  });
};

export const checkForMatch = async (userId: string): Promise<MatchingResponse> => {
  return handleTryCatch(async () => {
    const { data: existingMatch, error: matchError } = await supabase
      .from('toilet_smash_matching')
      .select('*')
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .maybeSingle();

    if (matchError) {
      console.error('Match check error:', matchError);
      throw new Error(matchError.message);
    }

    return existingMatch as MatchingEntry;
  });
};

export const subscribeToMatching = (userId: string, onMatch: (matching: MatchingEntry) => void) => {
  console.log('Setting up subscription for:', userId);

  const channel = supabase.channel(`matching_${userId}`, {
    config: {
      broadcast: { self: true }
    }
  })
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'toilet_smash_matching',
      filter: `player1_id=eq.${userId}:text,player2_id=eq.${userId}:text`
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
      console.error('Cancel matching error:', error);
      throw new Error(error.message);
    }

    return null;
  });
};