import { Component } from '@angular/core';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import {
  AutoDjSettings,
  PlayerSong,
  QueueSong,
  Song,
} from './auto-di.interfaces';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  imports: [PlaylistComponent, AudioPlayerComponent, NgClass],
})
export class AutoDjComponent {
  public playingSongs: PlayerSong[] = [];
  public playlistState: 'playing' | 'paused' | 'stopped' = 'stopped';
  public autoDjSettings: AutoDjSettings = {
    transitionTIme: 6,
  };
  private fadeTime = this.autoDjSettings.transitionTIme / 2;
  private queue: QueueSong[] = [];

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
    // TODO: Implement
    this.playlistState = 'stopped';
  }

  // [ Private Functions ]

  private async playQueueFromBeginning(): Promise<void> {
    const queue = this.recreateQueue();
    this.playQueueWithTransitions(queue);
  }

  private async playQueueWithTransitions(queue: QueueSong[]): Promise<void> {
    let currentSongIndex = 0;
    this.playlistState = 'playing';
    this.playingSongs = [];
    let activeSong = null;
    let fadingOutSong = null;
    // Repeat playing songs with transitions until no more songs in queue
    while (this.playlistState === 'playing') {
      // Get next song
      activeSong = queue[currentSongIndex];
      let songDuration = activeSong.duration - this.fadeTime;
      // Add and start playing
      this.startPlayingSong(activeSong);
      if (fadingOutSong) {
        // Wait until song is completely faded out
        await this.waitInSeconds(this.fadeTime);
        this.removeSongFromPlayers(fadingOutSong);
        songDuration -= this.fadeTime;
      }
      // Wait until song starts to fade out
      await this.waitInSeconds(songDuration);
      fadingOutSong = activeSong;
      currentSongIndex++;
      if (currentSongIndex >= queue.length) {
        this.playlistState = 'stopped';
        if (fadingOutSong) {
          this.removeSongFromPlayers(fadingOutSong);
        }
      }
    }
  }

  private startPlayingSong(song: QueueSong): void {
    const playerSong = {
      ...song,
      isCollapsed: true,
    };
    this.playingSongs.push(playerSong);
    setTimeout(() => {
      playerSong.isCollapsed = false;
    }, 10);
  }

  private removeSongFromPlayers(song: QueueSong): void {
    const index = this.playingSongs.findIndex((s) => s.id === song.id);
    this.playingSongs[index].isCollapsed = true;
    setTimeout(() => {
      this.playingSongs.splice(index, 1);
    }, 200);
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
        src: 'public/assets/test1.mp3',
        duration: 10,
      },
      {
        id: '2',
        title: 'Song 2',
        artist: 'Artist 2',
        src: 'public/assets/test2.mp3',
        duration: 10,
      },
      {
        id: '3',
        title: 'Song 3',
        artist: 'Artist 3',
        src: 'public/assets/test1.mp3',
        duration: 10,
      },
      {
        id: '4',
        title: 'Song 4',
        artist: 'Artist 4',
        src: 'public/assets/test2.mp3',
        duration: 10,
      },
    ];
  }
}
