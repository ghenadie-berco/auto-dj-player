import { Component } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  imports: [
    PlaylistComponent
  ],
})
export class AutoDjComponent {

}
