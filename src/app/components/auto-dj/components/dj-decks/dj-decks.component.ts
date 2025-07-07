import { Component } from '@angular/core';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { PlaylistSong } from '../playlist/playlist.interfaces';

@Component({
  selector: 'app-dj-decks',
  templateUrl: './dj-decks.component.html',
  styleUrl: './dj-decks.component.scss',
  imports: [AudioPlayerComponent],
})
export class DjDecksComponent {

  // [ Public ]

  public playQueue(playlist: PlaylistSong[]): void {
    console.log(playlist);
  }

}
