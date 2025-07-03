import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { AutoDjSettings, QueueSong, Song } from './auto-di.interfaces';
import { NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import { IndexedDbService } from '../../shared/services/indexeddb.service';

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
    transitionTime: 10,
  };
  private fadeTime = this.autoDjSettings.transitionTime;
  private queue: QueueSong[] = [];

  @ViewChild('playersAnchor', { read: ViewContainerRef })
  private playersAnchor: ViewContainerRef | undefined;

  @ViewChild(PlaylistComponent)
  private playlistComponent!: PlaylistComponent;

  constructor(private indexedDbService: IndexedDbService) {}

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
    this.playlistState = 'paused';
    this.activePlayerRefs.forEach((player) => {
      player.instance.pause();
    });
  }

  public onStop(): void {
    this.playlistState = 'stopped';
    this.activePlayerRefs.forEach((player) => {
      player.instance.stop();
    });
    this.playlistComponent.clearHighlight();
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
      // Highlight current song in playlist
      this.playlistComponent.highlightPlayingSong(song.id);
      
      // Update song src with blob URL for playback
      const blob = await this.indexedDbService.getBlobBySongId(song.id);
      if (blob) {
        song.src = URL.createObjectURL(blob);
      }
      
      const { canStartNextSong } = await this.playSongInNewPlayer(song);
      if (!canStartNextSong) {
        break;
      }
    }
    // Clear highlight when queue finishes
    this.playlistComponent.clearHighlight();
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
    // Make players fill available space
    this.activePlayerRefs.forEach((player) => {
      player.instance.fillAvaliableSpace();
    });
    // Subscribe to player events
    subscription$.add(
      playerRef.instance.started.subscribe(() => {
        this.activePlayerRefs.push(playerRef);
      })
    );
    subscription$.add(
      playerRef.instance.finished.subscribe(() => {
        this.activePlayerRefs = this.activePlayerRefs.filter(
          (p) => p !== playerRef
        );
        playerRef.destroy();
        subscription$.unsubscribe();
        // Zoom in remaining player
        this.activePlayerRefs.forEach((player) => {
          player.instance.fillAvaliableSpace();
        });
        // Revoke blob URL to free memory
        URL.revokeObjectURL(song.src);
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
    this.playlistState = 'playing';
    this.activePlayerRefs.forEach((player) => {
      player.instance.resume();
    });
  }

  private recreateQueue(): QueueSong[] {
    // TODO: implement shuffle check
    const playlist = this.playlistComponent.getPlaylistSongs();
    return playlist.map((song, index) => {
      return {
        ...song,
        playOrder: index,
      };
    });
  }

}
