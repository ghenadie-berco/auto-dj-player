import { Component } from '@angular/core';
import { PlaylistSong } from '../../../playlist/playlist.interfaces';

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent {

  public song: PlaylistSong | null = null;

}
