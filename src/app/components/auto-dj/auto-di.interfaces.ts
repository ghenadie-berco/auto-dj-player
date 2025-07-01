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

export interface PlayerSong extends QueueSong {
  isCollapsed: boolean;
}

export interface AutoDjSettings {
  transitionTIme: number;
}