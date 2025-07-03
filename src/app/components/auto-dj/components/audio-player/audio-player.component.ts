import {
  Component,
  signal,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { QueueSong } from '../../auto-di.interfaces';
import { Subject } from 'rxjs';
import WaveSurfer from 'wavesurfer.js';
import { SongTimePipe } from '../../../../shared/pipes/song-time.pipe';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  host: { class: 'component flex-auto' },
  imports: [SongTimePipe],
})
export class AudioPlayerComponent implements OnDestroy {
  // [ Public API ]

  public playFromBeginning(song: QueueSong, fadeTime: number = 0): void {
    this.song.set(song);
    this.remainingTime = song.totalTime;
    this.isCollapsed.set(false);
    setTimeout(() => {
      this.player = WaveSurfer.create({
        container: this.containerRef?.nativeElement,
        url: song.src,
        waveColor: '#006aff',
        progressColor: '#1a2883',
        cursorColor: '#1a2883',
        cursorWidth: 1,
        height: 'auto',
        // minPxPerSec: 100,
      });
      if (fadeTime > 0) {
        this.player.setVolume(0);
      }
      this.player.on('ready', () => {
        this.player?.play();
        this.fadeIn(fadeTime);
        this.started.next();
      });
      this.player.on('finish', () => {
        if (fadeTime === 0) {
          this.canStartPlayingNext.next();
        }
        this.finished.next();
      });
      this.player.on('timeupdate', () => {
        // Update remaining time
        this.remainingTime =
          this.song()!.totalTime - this.player!.getCurrentTime();
        // Check if we need to fade out
        if (fadeTime > 0 && !this.isFading) {
          if (this.remainingTime <= fadeTime) {
            this.fadeOut(fadeTime);
            this.canStartPlayingNext.next();
          }
        }
      });
    });
  }

  public pause(): void {
    this.player?.pause();
  }

  public resume(): void {
    this.player?.play();
  }

  public stop(): void {
    this.player?.stop();
    this.finished.next();
  }

  public fillAvaliableSpace(): void {
    this.player?.zoom(1);
  }

  // TODO: Implement fade out logic as well
  public canStartPlayingNext = new Subject<void>();
  public started = new Subject<void>();
  public finished = new Subject<void>();

  private isFading = false;

  // [ Internal ]

  @ViewChild('containerRef') private containerRef: ElementRef | undefined;
  public song = signal<QueueSong | null>(null);
  public player: WaveSurfer | null = null;
  public isCollapsed = signal(true);
  public remainingTime: number = 0;

  public ngOnDestroy(): void {
    this.player?.stop();
    this.player?.destroy();
    this.player = null;
    this.isCollapsed.set(false);
    setTimeout(() => {
      return;
    }, 200);
  }

  private fadeIn(fadeTime: number): void {
    if (fadeTime === 0) {
      return;
    }
    const interval = setInterval(() => {
      const currentVolume = this.player?.getVolume() || 0;
      if (currentVolume >= 1) {
        clearInterval(interval);
        return;
      }
      const newVolume = Math.min(currentVolume + 0.01, 1);
      this.player?.setVolume(newVolume);
    }, (fadeTime * 1000) / 100);
  }

  private fadeOut(fadeTime: number): void {
    if (fadeTime === 0) {
      return;
    }
    this.isFading = true;
    const interval = setInterval(() => {
      const currentVolume = this.player?.getVolume() || 0;
      if (currentVolume <= 0) {
        clearInterval(interval);
        return;
      }
      const newVolume = Math.max(currentVolume - 0.01, 0);
      this.player?.setVolume(newVolume);
    }, (fadeTime * 1000) / 100);
  }
}
