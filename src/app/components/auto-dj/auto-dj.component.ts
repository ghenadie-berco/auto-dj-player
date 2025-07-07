import { Component } from '@angular/core';
import { PlaybackComponent } from './components/playback/playback.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ControlsComponent } from './components/controls/controls.component';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  host: { class: 'component flex-col' },
  imports: [
    PlaybackComponent,
    PlaylistComponent,
    ControlsComponent,
  ],
})
export class AutoDjComponent {

}
