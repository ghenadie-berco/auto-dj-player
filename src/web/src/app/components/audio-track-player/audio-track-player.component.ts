import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Song } from '../../app.interfaces';
import WaveSurfer from 'wavesurfer.js';
import { SongTimePipe } from '../../pipes/song-time.pipe';

@Component({
  selector: 'app-audio-track-player',
  imports: [SongTimePipe],
  templateUrl: './audio-track-player.component.html',
  styleUrl: './audio-track-player.component.scss',
})
export class AudioTrackPlayerComponent implements OnInit, AfterViewInit {
  public label = input.required<string>();
  public volume = input.required<number>();
  public fadeTime = input.required<number>();
  public fadeTimeReached = output<void>();

  public _internalSong = signal<Song | null>(null);
  public _internalVolume = 0;
  public _waveSurferContainer = viewChild<ElementRef<HTMLDivElement>>(
    'waveSurferContainer'
  );
  public totalTime = signal(0);
  public currentTime = signal(0);
  public remainingTime = signal(0);
  private _waveSurfer: WaveSurfer | null = null;
  private fadeOutNotified = false;

  public loadNewTrack(song: Song, volume: number) {
    this._internalSong.set(song);
    this._internalVolume = volume;
    if (this._waveSurfer) {
      this._waveSurfer.load(song.src);
      this.computeSongTime();
    }
  }

  public setVolume(volume: number) {
    this._internalVolume = volume;
    if (this._waveSurfer) {
      this._waveSurfer.setVolume(volume === 0 ? 0 : volume / 100);
    }
  }

  public getRemainingTime() {
    if (!this._waveSurfer) {
      return 0;
    }
    return this._waveSurfer.getDuration() - this._waveSurfer.getCurrentTime();
  }

  // [ Internal ]

  public ngOnInit(): void {
    this._internalVolume = this.volume();
  }

  public ngAfterViewInit(): void {
    this._waveSurfer = WaveSurfer.create({
      container: this._waveSurferContainer()!.nativeElement,
      waveColor: 'rgb(200, 0, 200)',
      progressColor: 'rgb(100, 0, 100)',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      sampleRate: 44100,
      normalize: true,
      minPxPerSec: 100,
    });
    this._waveSurfer.once('ready', () => {
      this.computeSongTime();
    });
    this._waveSurfer.on('timeupdate', () => {
      this.computeSongTime();
    });
  }

  // Events

  public onPlay() {
    if (this._waveSurfer) {
      this._waveSurfer.play();
      this._waveSurfer.on('timeupdate', () => {
        this.notifyWhenFadeTimeReached();
      });
    }
  }

  public onPause() {
    if (this._waveSurfer) {
      this._waveSurfer.pause();
    }
  }

  public onStop() {
    if (this._waveSurfer) {
      this._waveSurfer.stop();
    }
  }

  // Helpers

  private computeSongTime() {
    if (!this._waveSurfer) {
      return;
    }
    this.totalTime.set(this._waveSurfer.getDuration());
    this.currentTime.set(this._waveSurfer.getCurrentTime());
    this.remainingTime.set(this.getRemainingTime());
  }

  private notifyWhenFadeTimeReached() {
    if (!this.fadeOutNotified && this.remainingTime() <= this.fadeTime()) {
      this.fadeTimeReached.emit();
      this.fadeOutNotified = true;
    }
  }
}
