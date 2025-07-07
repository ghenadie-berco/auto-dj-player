// Angular
import { Component, input, output } from '@angular/core';
// Components
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { PauseButtonComponent } from './components/pause-button/pause-button.component';
import { StopButtonComponent } from './components/stop-button/stop-button.component';
import { PlaylistState } from '../../auto-dj.types';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.scss',
  imports: [
    PlayButtonComponent,
    PauseButtonComponent,
    StopButtonComponent
  ],
})
export class ControlsComponent {

  // [ Public ]
  
  public playlistState = input.required<PlaylistState>();
  public play = output<void>();
  public pause = output<void>();
  public stop = output<void>();

  // [ Internal ]


  public onPlay(): void {
    this.play.emit();
  }

  public onPause(): void {
    this.pause.emit();
  }

  public onStop(): void {
    this.stop.emit();
  }

}
