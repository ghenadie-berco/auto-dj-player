// Angular
import { Component, output, viewChild } from '@angular/core';
// Components
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
// Interfaces
import { PlaylistSong } from '../playlist/playlist.interfaces';

@Component({
  selector: 'app-dj-decks',
  templateUrl: './dj-decks.component.html',
  styleUrl: './dj-decks.component.scss',
  imports: [AudioPlayerComponent],
})
export class DjDecksComponent {
  // [ Public ]

  public activeSongChange = output<{ songId: string }>();

  public play(queue: PlaylistSong[], transitionTime: number = 0): void {
    this.clear();
    void this.playQueue(queue, transitionTime);
  }

  public resume(): void {
    this.player1Ref()!.resume();
    this.player2Ref()!.resume();
  }

  public pause(): void {
    this.player1Ref()!.pause();
    this.player2Ref()!.pause();
  }

  public stop(): void {
    this.player1Ref()!.stop();
    this.player2Ref()!.stop();
  }

  public clear(): void {
    this.player1Ref()!.clear();
    this.player2Ref()!.clear();
  }

  // [ Internal ]

  public player1Ref = viewChild<AudioPlayerComponent>('player1');
  public player2Ref = viewChild<AudioPlayerComponent>('player2');

  // Private Functions

  private async playQueue(queue: PlaylistSong[], transitionTime: number = 0): Promise<void> {
    // Edge cases
    if (!this.player1Ref()) {
      throw new Error('Player 1 was not found');
    }
    if (!this.player2Ref()) {
      throw new Error('Player 2 was not found');
    }
    // Logic
    for (let song of queue) {
      this.activeSongChange.emit({ songId: song.id });
      await this.playSong(song, transitionTime);
    }
  }

  private async playSong(song: PlaylistSong, transitionTime: number = 0): Promise<void> {
    if (this.player1Ref()!.isAvailable()) {
      await this.player1Ref()!.play(song, transitionTime);
    } else if (this.player2Ref()!.isAvailable()) {
      await this.player2Ref()!.play(song, transitionTime);
    }
  }


}
