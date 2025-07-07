import { Component } from '@angular/core';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@Component({
  selector: 'app-dj-decks',
  templateUrl: './dj-decks.component.html',
  styleUrl: './dj-decks.component.scss',
  imports: [AudioPlayerComponent],
})
export class DjDecksComponent {

}
