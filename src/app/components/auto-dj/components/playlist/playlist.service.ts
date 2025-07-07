// Angular
import { Injectable } from "@angular/core";
// Interfaces
import { PlaylistSong } from "./playlist.interfaces";

@Injectable()
export class PlaylistService {

  public async getAppDefaultSongs(): Promise<PlaylistSong[]> {
    // tODO: implement
    return this.dummyDefaultSongs();
  }

  public async getUserSongs(): Promise<PlaylistSong[]> {
    return this.dummyUserSongs();
  }

  // TODO: Remove temporary dummy data

  private dummyDefaultSongs(): PlaylistSong[] {
    return [
      {
        id: '1',
        artist: 'Artist Name 1',
        title: 'Song Title 1',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
      {
        id: '2',
        artist: 'Artist Name 2',
        title: 'Song Title 2',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
      {
        id: '3',
        artist: 'Artist Name 3',
        title: 'Song Title 3',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
    ]
  }
  
  private dummyUserSongs(): PlaylistSong[] {
    return [
      {
        id: '4',
        artist: 'Artist Name 4',
        title: 'Song Title 4',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
      {
        id: '5',
        artist: 'Artist Name 5',
        title: 'Song Title 5',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
      {
        id: '6',
        artist: 'Artist Name 6',
        title: 'Song Title 6',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
        isDefault: true
      },
    ]
  }

}