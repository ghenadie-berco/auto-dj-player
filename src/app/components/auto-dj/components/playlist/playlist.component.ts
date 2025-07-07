// Angular
import { Component, inject, OnInit, signal } from '@angular/core';
// Services
import { PlaylistService } from './playlist.service';
// Pipes
import { SongTimePipe } from '../../../../shared/pipes/song-time.pipe';
// Interfaces
import { PlaylistSong } from './playlist.interfaces';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
  providers: [PlaylistService],
  imports: [SongTimePipe],
})
export class PlaylistComponent implements OnInit {

  // [ Public ]

  public getPlaylist(): PlaylistSong[] {
    return this.playlist();
  }

  public setActiveSongId(songId: string): void {
    this.activeSongId.set(songId);
  }

  // [ Internal ]

  // Deps

  private _service = inject(PlaylistService);

  // Vars

  public isLoading = signal<boolean>(false);
  public playlist = signal<PlaylistSong[]>([]);
  public activeSongId = signal<string>('');

  public ngOnInit(): void {
    void this.loadPlaylist();
  }

  private async loadPlaylist(): Promise<void> {
    this.isLoading.set(true);
    const defaultSongs = await this._service.getAppDefaultSongs();
    this.isLoading.set(false);
    this.playlist.set([
      ...defaultSongs
    ]);
  }

}
