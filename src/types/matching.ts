export interface MatchingEntry {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_location_id: number;
  player2_location_id: number;
  created_at: string;
}

export interface MatchingResponse {
  data: MatchingEntry | null;
  error: Error | null;
}