import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { AutoDjSettings, QueueSong, Song } from './auto-di.interfaces';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  imports: [PlaylistComponent, NgClass],
})
export class AutoDjComponent {
  public playlistState: 'playing' | 'paused' | 'stopped' = 'stopped';
  public activePlayerRefs: ComponentRef<AudioPlayerComponent>[] = [];
  public autoDjSettings: AutoDjSettings = {
    transitionTIme: 30,
  };
  private fadeTime = this.autoDjSettings.transitionTIme / 2;
  private queue: QueueSong[] = [];

  @ViewChild('playersAnchor', { read: ViewContainerRef })
  private playersAnchor: ViewContainerRef | undefined;

  public onPlay(): void {
    // If player was stopped, start from beginning
    if (this.playlistState === 'stopped') {
      this.queue = this.recreateQueue();
      this.playQueueFromBeginning();
    } else {
      this.resumePlayingQueue();
    }
  }

  public onPause(): void {
    // TODO: Implement
    this.playlistState = 'paused';
  }

  public onStop(): void {
    this.playlistState = 'stopped';
    this.activePlayerRefs.forEach((player) => {
      player.instance.stop();
    });
  }

  // [ Private Functions ]

  private async playQueueFromBeginning(): Promise<void> {
    // Check edge cases
    if (!this.playersAnchor) {
      throw new Error('Players container not found');
    }
    if (this.playlistState === 'playing') {
      return;
    }
    // Get new queue
    const queue = this.recreateQueue();
    // Queue edge case
    if (queue.length === 0) {
      return;
    }
    // Queue play algorithm
    this.playlistState = 'playing';
    this.playQueueUntilFinished(queue);
  }

  private async playQueueUntilFinished(queue: QueueSong[]): Promise<void> {
    for (const song of queue) {
      const { canStartNextSong } = await this.playSongInNewPlayer(song);
      if (!canStartNextSong) {
        break;
      }
    }
  }

  private playSongInNewPlayer(
    song: QueueSong
  ): Promise<{ canStartNextSong: boolean }> {
    if (!this.playersAnchor) {
      throw new Error('Players container not found');
    }
    const subscription$ = new Subscription();
    const playerRef = this.playersAnchor.createComponent(AudioPlayerComponent);
    playerRef.instance.playFromBeginning(song, this.fadeTime);
    this.activePlayerRefs.push(playerRef);
    subscription$.add(
      playerRef.instance.finished.subscribe(() => {
        console.log('Song finished');
        this.activePlayerRefs = this.activePlayerRefs.filter(
          (p) => p !== playerRef
        );
        playerRef.destroy();
        subscription$.unsubscribe();
      })
    );
    return new Promise((resolve) => {
      subscription$.add(
        playerRef.instance.canStartPlayingNext.subscribe(() => {
          resolve({ canStartNextSong: true });
        })
      );
    });
  }

  private resumePlayingQueue(): void {
    // TODO: Implement
  }

  private waitInSeconds(sec: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, sec * 1000);
    });
  }

  private recreateQueue(): QueueSong[] {
    // TODO: implement shuffle check
    const playlist = this.getDummyPlaylist();
    return playlist.map((song, index) => {
      return {
        ...song,
        playOrder: index,
      };
    });
  }

  private getDummyPlaylist(): Song[] {
    return [
      {
        id: '1',
        title: 'Song 1',
        artist: 'Artist 1',
        src: 'assets/test1.mp3',
        duration: 10,
      },
      {
        id: '2',
        title: 'Song 2',
        artist: 'Artist 2',
        src: 'assets/test2.mp3',
        duration: 10,
      },
      {
        id: '3',
        title: 'Song 3',
        artist: 'Artist 3',
        src: 'assets/test1.mp3',
        duration: 10,
      },
      {
        id: '4',
        title: 'Song 4',
        artist: 'Artist 4',
        src: 'assets/test2.mp3',
        duration: 10,
      },
    ];
  }
}
