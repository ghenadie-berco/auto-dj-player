export interface Song {
  id: string;
  title: string;
  artist: string;
  src: string;
  totalTime: number; // in seconds
}

export interface QueueSong extends Song {
  playOrder: number;
}

export interface AutoDjSettings {
  transitionTime: number;
}