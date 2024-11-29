export interface WaitlistEntry {
  id: string;
  location_id: number;
  user_id: string;
  created_at: string;
}

export interface MatchState {
  isWaiting: boolean;
  error?: string;
}