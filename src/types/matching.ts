export interface MatchingEntry {
  id: string;
  player1_id: string;
  player2_id: string;
  player1_location_id: number;
  player2_location_id: number;
  player1_result: "win" | "lose" | null;
  player2_result: "win" | "lose" | null;
  created_at: string;
}

export interface MatchingResponse {
  data: MatchingEntry | null;
  error: Error | null;
}