import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Song } from '../../app.interfaces';
import WaveSurfer from 'wavesurfer.js';

@Component({
  selector: 'app-audio-track-player',
  imports: [],
  templateUrl: './audio-track-player.component.html',
  styleUrl: './audio-track-player.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AudioTrackPlayerComponent implements OnInit, AfterViewInit {
  public label = input.required<string>();
  public volume = input.required<number>();

  public _internalSong = signal<Song | null>(null);
  public _internalVolume = 0;
  public _waveSurferContainer = viewChild<ElementRef<HTMLDivElement>>(
    'waveSurferContainer'
  );
  private _waveSurfer: WaveSurfer | null = null;

  public loadNewTrack(song: Song, volume: number) {
    this._internalSong.set(song);
    this._internalVolume = volume;
    if (this._waveSurfer) {
      this._waveSurfer.load(song.src);
    }
  }

  public setVolume(volume: number) {
    this._internalVolume = volume;
    // if (this._internalAudio) {
    //   const audioVolume = this._internalVolume === 0 ? 0 : this._internalVolume / 100;
    //   this._internalAudio.fade(this._internalAudio.volume(), audioVolume, 10);
    // }
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
    });
  }

  // Events

  public onPlay() {
    if (this._waveSurfer) {
      this._waveSurfer.play();
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
}
