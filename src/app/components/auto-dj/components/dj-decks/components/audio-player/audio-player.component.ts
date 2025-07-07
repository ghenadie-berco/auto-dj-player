import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import { PlaylistSong } from '../../../playlist/playlist.interfaces';
import WaveSurfer from 'wavesurfer.js';
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

  public async play(song: PlaylistSong): Promise<void> {
    this.song.set(song);
    this.player?.load(song.src);
    await this.playSongUntil(song.duration);
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

  private async playSongUntil(endTime: number): Promise<void> {
    return new Promise((resolve) => {
      this.player?.on('timeupdate', (currentTime: number) => {
        // Update remaining time
        this.remainingTime.set(this.song()!.duration - currentTime);
        // Check if time to resolve
        if (currentTime >= endTime) {
          resolve();
        }
      });
      this.player?.play();
    });
  }
}
