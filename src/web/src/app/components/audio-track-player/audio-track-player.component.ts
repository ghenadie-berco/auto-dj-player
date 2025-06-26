import { Component, input, OnInit, signal } from '@angular/core';
import { Song } from '../../app.interfaces';
import { Howl } from 'howler';

@Component({
  selector: 'app-audio-track-player',
  imports: [],
  templateUrl: './audio-track-player.component.html',
  styleUrl: './audio-track-player.component.scss',
})
export class AudioTrackPlayerComponent implements OnInit {
  public label = input.required<string>();
  public volume = input.required<number>();

  public _internalSong = signal<Song | null>(null);
  public _internalVolume = 0;
  public _internalAudio: Howl | null = null;

  public loadNewTrack(song: Song, volume: number) {
    if (this._internalAudio) {
      this._internalAudio.stop();
      this._internalAudio = null;
    }
    this._internalSong.set(song);
    this._internalVolume = volume;
    this._internalAudio = new Howl({
      src: [song.src],
      volume: this._internalVolume === 0 ? 0 : this._internalVolume / 100,
    });
  }

  public setVolume(volume: number) {
    this._internalVolume = volume;
    if (this._internalAudio) {
      const audioVolume = this._internalVolume === 0 ? 0 : this._internalVolume / 100;
      this._internalAudio.fade(this._internalAudio.volume(), audioVolume, 10);
    }
  }

  // [ Internal ]

  public ngOnInit(): void {
    this._internalVolume = this.volume();
  }

  // Events

  public onPlay() {
    if (this._internalAudio) {
      this._internalAudio.play();
    }
  }

  public onPause() {
    if (this._internalAudio) {
      this._internalAudio.pause();
    }
  }

  public onStop() {
    if (this._internalAudio) {
      this._internalAudio.stop();
    }
  }

}
