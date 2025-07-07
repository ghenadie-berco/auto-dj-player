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
      },
      {
        id: '4',
        title: 'Life Gets Hard',
        artist: 'Foletto & Victor Arruda',
        src: '/assets/Foletto & Victor Arruda - Life Gets Hard.mp3',
        duration: 424
      },
      {
        id: '5',
        title: 'Electrolog',
        artist: 'Hyenah & Kasango',
        src: '/assets/Hyenah & Kasango - Electrolog.mp3',
        duration: 385
      },
      {
        id: '6',
        title: 'Origin',
        artist: 'Joep Mencke',
        src: '/assets/Joep Mencke – Origin (Original Mix).mp3',
        duration: 355
      },
      {
        id: '7',
        title: 'Say What (feat. Chuala)',
        artist: 'Rampa, &ME, Adam Port',
        src: '/assets/Keinemusik - (Rampa, &ME, Adam Port) - Say What (feat. Chuala).mp3',
        duration: 181
      },
      {
        id: '8',
        title: 'Ekēle',
        artist: 'Kora (CA) & Wuachuma',
        src: '/assets/Kora (CA) & Wuachuma - Ekēle.mp3',
        duration: 377
      },
      {
        id: '9',
        title: 'Envoy',
        artist: 'Makebo',
        src: '/assets/Makebo - Envoy.mp3',
        duration: 507
      },
      {
        id: '10',
        title: 'Tranquility',
        artist: 'Nora en Pure',
        src: '/assets/Nora en Pure - Tranquility.mp3',
        duration: 224
      },
    ];
  }

 

}