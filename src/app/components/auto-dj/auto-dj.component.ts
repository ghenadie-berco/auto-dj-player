import { Component } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ControlsComponent } from './components/controls/controls.component';
import { DjDecksComponent } from './components/dj-decks/dj-decks.component';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  host: { class: 'component flex-col' },
  imports: [
    DjDecksComponent,
    PlaylistComponent,
    ControlsComponent,
  ],
})
export class AutoDjComponent {

}
