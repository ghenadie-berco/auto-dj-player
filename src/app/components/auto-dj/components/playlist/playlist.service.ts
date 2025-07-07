// Angular
import { Injectable } from "@angular/core";
// Interfaces
import { PlaylistSong } from "./playlist.interfaces";

@Injectable()
export class PlaylistService {

  public getAppDefaultSongs(): PlaylistSong[] {
    return [
      {
        id: '1',
        title: 'Angiru',
        artist: 'Brian David',
        src: '/assets/Brian David - Angiru.mp3',
        duration: 441,
      },
      {
        id: '2',
        title: 'Breathing (Original Mix)',
        artist: 'Deco (BE)',
        src: '/assets/Deco (BE) - Breathing (Original Mix).mp3',
        duration: 456
      },
      {
        id: '3',
        title: 'Bright Times Await Us (Extended Mix)',
        artist: 'Dimitri Mediator',
        src: '/assets/Dimitri Mediator - Bright Times Await Us (Extended Mix).mp3',
        duration: 401
      }
    ];
  }

 

}