// Angular
import { Component, signal, viewChild } from '@angular/core';
// Components
import { PlaylistComponent } from './components/playlist/playlist.component';
import { ControlsComponent } from './components/controls/controls.component';
import { DjDecksComponent } from './components/dj-decks/dj-decks.component';
// Types
import { PlaylistState } from './auto-dj.types';

@Component({
  selector: 'app-auto-dj',
  templateUrl: './auto-dj.component.html',
  styleUrl: './auto-dj.component.scss',
  host: { class: 'component flex-col' },
  imports: [DjDecksComponent, PlaylistComponent, ControlsComponent],
})
export class AutoDjComponent {

  // [ Internal ]

  public playlistState = signal<PlaylistState>('stopped');
  public playlistRef = viewChild(PlaylistComponent);
  public djDecksRef = viewChild(DjDecksComponent);

  // Events

  public onPlay(): void {
    // Edge cases
    if (!this.playlistRef()) {
      throw new Error('Playlist is not available');
    }
    if (!this.djDecksRef()) {
      throw new Error('DJ Decks is not available');
    }
    // Logic
    if (this.playlistState() === 'paused') {
      this.djDecksRef()!.resume();
    } else {
      // Get queue
      const queue = this.playlistRef()!.getPlaylist();
      // Begin playing the playlist
      this.djDecksRef()!.play(queue, 10);
    }
    // Set playlist state
    this.playlistState.set('playing');
  }

  public onPause(): void {
    this.djDecksRef()!.pause();
    this.playlistState.set('paused');
  }

  public onStop(): void {
    this.djDecksRef()!.stop();
    this.djDecksRef()!.clear();
    this.playlistState.set('stopped');
    this.playlistRef()!.setActiveSongId('');
  }

  public onActiveSongChange(e: { songId: string }): void {
    this.playlistRef()!.setActiveSongId(e.songId);
  }
}
