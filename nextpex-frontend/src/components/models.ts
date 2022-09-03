export type PlayHistoryEntry = {
  username: string;
  gamename: string;
  started_at: number;
  ended_at: number;
};

export type PlayingEntry = {
  username: string;
  gamename: string;
  started_at: number;
  // playingTime: number; // in milliseconds
};
