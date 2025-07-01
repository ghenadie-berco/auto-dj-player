import { Component } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  imports: [
    PlaylistComponent,
    AudioPlayerComponent,
  ],
})
export class AutoDjComponent {

}
