export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  duration: number;
}

export interface QueueSong extends Song {
  playOrder: number;
}

export interface AutoDjSettings {
  transitionTIme: number;
}