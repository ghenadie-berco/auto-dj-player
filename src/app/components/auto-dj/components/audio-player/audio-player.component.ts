import { Component, input, OnInit } from '@angular/core';
import { PlayerSong } from '../../auto-di.interfaces';
import { SongTimePipe } from '../../../../shared/pipes/song-time.pipe';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  imports: [SongTimePipe],
})
export class AudioPlayerComponent implements OnInit {

  public song = input.required<PlayerSong>();

  public remainingTime: number = 0;

  public ngOnInit(): void {
    this.remainingTime = this.song().duration;
    this.updateRemainingTime();
  }

  private updateRemainingTime(): void {
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

}
