// Angular
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
// Wavesurfer JS
import WaveSurfer from 'wavesurfer.js';
// Interfaces
import { PlaylistSong } from '../../../playlist/playlist.interfaces';
// Pipes
import { SongTimePipe } from '../../../../../../shared/pipes/song-time.pipe';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  host: { class: 'component flex-col' },
  imports: [SongTimePipe],
})
export class AudioPlayerComponent implements AfterViewInit {
  // [ Public ]

  public isAvailable = computed(() => !this.song());

  public async play(
    song: PlaylistSong,
    transitionTime: number = 0
  ): Promise<void> {
    this.song.set(song);
    this.player?.load(song.src);
    await this.playSongUntil(song.duration - transitionTime, transitionTime);
  }

  public pause(): void {
    this.player?.pause();
  }

  public resume(): void {
    this.player?.play();
  }

  public stop(): void {
    this.player?.stop();
  }

  public clear(): void {
    this.song.set(null);
    this.remainingTime.set(null);
    this.player?.unAll();
    this.player?.destroy();
    this.player = undefined;
    this.createEmptyPlayer();
  }

  // [ Internal ]

  public song = signal<PlaylistSong | null>(null);
  public remainingTime = signal<number | null>(null);

  private waveSurferContainerRef = viewChild<ElementRef<HTMLDivElement>>(
    'waveSurferContainer'
  );
  private player: WaveSurfer | undefined;
  private isFadingOut = false;

  // Lifecycle Hooks

  public ngAfterViewInit(): void {
    this.createEmptyPlayer();
  }

  // Private Functions

  private createEmptyPlayer(): void {
    this.player = WaveSurfer.create({
      container: this.waveSurferContainerRef()!.nativeElement,
      waveColor: '#006aff',
      progressColor: '#1a2883',
      cursorColor: '#1a2883',
      cursorWidth: 1,
      height: 'auto',
      fillParent: true,
      sampleRate: 48000,
    });

    // Subscibe to events
    this.player?.on('finish', () => {
      this.clear();
    });
  }

  private async playSongUntil(
    endTime: number,
    transitionTime: number = 0
  ): Promise<void> {
    return new Promise((resolve) => {
      this.player?.on('timeupdate', (currentTime: number) => {
        // Update remaining time
        this.remainingTime.set(this.song()!.duration - currentTime);
        // Check if time to resolve
        if (currentTime >= endTime) {
          // Check if fade out is needed
          if (transitionTime > 0 && !this.isFadingOut) {
            this.isFadingOut = true;
            this.fadeOutVolume(transitionTime);
          }
          resolve();
        }
      });
      // Play
      this.player?.play();
      // Fade it if needed
      if (transitionTime > 0) {
        this.fadeInVolume(transitionTime);
      }
    });
  }

  private fadeInVolume(fadeTime: number): void {
    if (fadeTime === 0) {
      return;
    }
    this.player?.setVolume(0);
    const interval = setInterval(() => {
      const currentVolume = this.player?.getVolume() || 0;
      if (currentVolume >= 1) {
        clearInterval(interval);
        return;
      }
      const newVolume = parseFloat(Math.min(currentVolume + 0.01, 1).toFixed(2));
      this.player?.setVolume(newVolume);
    }, (fadeTime * 1000) / 100);
  }

  private fadeOutVolume(fadeTime: number): void {
    if (fadeTime === 0) {
      return;
    }
    const interval = setInterval(() => {
      const currentVolume = this.player?.getVolume() || 0;
      if (currentVolume <= 0) {
        clearInterval(interval);
        this.isFadingOut = false;
        return;
      }
      const newVolume = parseFloat(Math.max(currentVolume - 0.01, 0).toFixed(2));
      this.player?.setVolume(newVolume);
    }, (fadeTime * 1000) / 100);
  }
}
