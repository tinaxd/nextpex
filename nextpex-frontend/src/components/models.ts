export type PlayHistoryEntry = {
  username: string;
  game: string;
  startTime: Date;
  endTime: Date;
};

export type PlayingEntry = {
  username: string;
  game: string;
  startTime: Date;
  playingTime: number; // in milliseconds
};
