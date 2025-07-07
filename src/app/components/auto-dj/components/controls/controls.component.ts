import { Component } from '@angular/core';
import { PlayButtonComponent } from './components/play-button/play-button.component';
import { PauseButtonComponent } from './components/pause-button/pause-button.component';
import { StopButtonComponent } from './components/stop-button/stop-button.component';

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

  public playState: 'playing' | 'paused' | 'stopped' = 'stopped';

  public onPlay(): void {
    // TODO: implement
    this.playState = 'playing';
  }

  public onPause(): void {
    // TODO: implement
    this.playState = 'paused';
  }

  public onStop(): void {
    // TODO: implement
    this.playState = 'stopped';
  }

}
