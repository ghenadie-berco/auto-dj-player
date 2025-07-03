import {
  Component,
  ElementRef,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { IndexedDbService } from '../../../../shared/services/indexeddb.service';
import { Song } from '../../auto-di.interfaces';
import { NgClass } from '@angular/common';
import { SongTimePipe } from '../../../../shared/pipes/song-time.pipe';
import { StorageSizePipe } from '../../../../shared/pipes/storage-size.pipe';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss',
  imports: [NgClass, SongTimePipe, StorageSizePipe],
})
export class PlaylistComponent implements OnInit {
  public fileInput = viewChild.required('fileInput', {
    read: ElementRef<HTMLInputElement>,
  });

  public songs: Song[] = [];
  public highlightedSongId: string | null = null;
  public isLoading = signal(false);

  constructor(public indexedDbService: IndexedDbService) {}

  async ngOnInit(): Promise<void> {
    await this.loadPlaylistFromDb();
  }

  public selectFiles(): void {
    this.fileInput().nativeElement.click();
  }

  public async onFilesSelected(event: Event): Promise<void> {
    // Upload mp3 files to IndexedDB
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.isLoading.set(true);
      try {
        await this.indexedDbService.loadFilesToIndexedDB(input.files);
        await this.loadPlaylistFromDb();
        input.value = ''; // Clear the input
      } catch (error) {
        console.error('Error loading files:', error);
        alert('Error loading files. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  public async clearPlaylist(): Promise<void> {
    // Sample code to handle clearing the playlist
    if (confirm('Are you sure you want to clear the entire playlist?')) {
      this.isLoading.set(true);
      try {
        await this.indexedDbService.clearAllSongs();
        this.songs = [];
        this.highlightedSongId = null;
      } catch (error) {
        console.error('Error clearing playlist:', error);
        alert('Error clearing playlist. Please try again.');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  public async deleteSong(songId: string, event: Event): Promise<void> {
    // Sample code to handle song deletion
    event.stopPropagation(); // Prevent song click event
    if (confirm('Are you sure you want to delete this song?')) {
      try {
        await this.indexedDbService.deleteSong(songId);
        this.songs = this.songs.filter((song) => song.id !== songId);
        if (this.highlightedSongId === songId) {
          this.highlightedSongId = null;
        }
      } catch (error) {
        console.error('Error deleting song:', error);
        alert('Error deleting song. Please try again.');
      }
    }
  }

  public onSongClick(song: Song): void {
    console.log('Song clicked:', song);
  }

  // [ Public Methods ]

  public getPlaylistSongs(): Song[] {
    return this.songs;
  }

  public highlightPlayingSong(songId: string): void {
    this.highlightedSongId = songId;
  }

  public clearHighlight(): void {
    this.highlightedSongId = null;
  }

  // [ Private Methods ]

  private async loadPlaylistFromDb(): Promise<void> {
    try {
      this.songs = await this.indexedDbService.getPlaylistSongs();
    } catch (error) {
      console.error('Error loading playlist from database:', error);
      this.songs = [];
    }
  }
}
