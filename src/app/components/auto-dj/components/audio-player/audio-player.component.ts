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

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
  host: { class: 'component flex-auto' },
  imports: [],
})
export class AudioPlayerComponent implements OnDestroy {
  // [ Public API ]

  public playFromBeginning(song: QueueSong, fadeTime: number = 0): void {
    this.song.set(song);
    this.remainingTime = song.duration;
    this.isCollapsed.set(false);
    setTimeout(() => {
      this.player = WaveSurfer.create({
        container: this.containerRef?.nativeElement,
        url: song.src,
        waveColor: 'violet',
        progressColor: 'purple',
        cursorColor: 'violet',
        cursorWidth: 1,
        height: 'auto',
      });
      if (fadeTime > 0) {
        this.player.setVolume(0);
      }
      this.player.on('ready', () => {
        this.player?.play();
        this.fadeIn(fadeTime);
        this.updateRemainingTime();
      });
      this.player.on('finish', () => {
        this.canStartPlayingNext.next();
        this.finished.next();
      });
    })
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

  // TODO: Implement fade out logic as well
  public canStartPlayingNext = new Subject<void>();
  public finished = new Subject<void>();

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

  private updateRemainingTime(): void {
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime === 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
}
