import { Injectable } from '@angular/core';
import { Dexie, Table } from 'dexie';
import { Song } from '../../components/auto-dj/auto-di.interfaces';
import { parseBlob } from 'music-metadata-browser';
import { BehaviorSubject } from 'rxjs';

interface StoredSong extends Song {
  blob: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService extends Dexie {
  songs!: Table<StoredSong>;
  
  public totalCapacity: number = 0;
  public availableSpace: number = 0;
  public loadingProgress$ = new BehaviorSubject<{current: number, total: number, message: string}>({
    current: 0,
    total: 0,
    message: ''
  });

  constructor() {
    super('AutoDJDatabase');
    this.version(1).stores({
      songs: 'id, title, artist, src, totalTime, blob'
    });
    
    this.initializeStorageInfo();
  }

  private async initializeStorageInfo(): Promise<void> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        this.totalCapacity = Math.floor((estimate.quota || 0));
        this.availableSpace = Math.floor(((estimate.quota || 0) - (estimate.usage || 0)));
      }
    } catch (error) {
      console.warn('Storage estimation not available:', error);
    }
  }

  public async loadFilesToIndexedDB(files: FileList): Promise<void> {
    const totalFiles = files.length;
    this.loadingProgress$.next({ current: 0, total: totalFiles, message: 'Starting to load files...' });

    const promises = Array.from(files).map(async (file, index) => {
      if (file.type === 'audio/mpeg' || file.type === 'audio/mp3') {
        const [duration, metadata] = await Promise.all([
          this.getAudioDuration(file),
          this.getAudioMetadata(file)
        ]);
        
        const song: StoredSong = {
          id: this.generateId(),
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ""),
          artist: metadata.artist || 'Unknown Artist',
          src: URL.createObjectURL(file), // Temporary URL for playback
          totalTime: duration,
          blob: file
        };
        
        await this.songs.add(song);
        this.loadingProgress$.next({ current: index + 1, total: totalFiles, message: `Loaded ${metadata.title}` });
      }
    });
    
    await Promise.all(promises);
    await this.updateStorageInfo();
    this.loadingProgress$.next({ current: totalFiles, total: totalFiles, message: 'All files loaded.' });
  }

  public async loadDefaultSongsFromPlaylist(): Promise<void> {
    try {
      // Fetch the playlist.json file
      const response = await fetch('/playlist.json');
      if (!response.ok) {
        console.warn('Could not load playlist.json:', response.statusText);
        return;
      }
      
      const playlistData = await response.json();
      const songUrls: string[] = playlistData.songs || [];
      
      this.loadingProgress$.next({ current: 0, total: songUrls.length, message: 'Loading default songs from playlist...' });
      
      // Process each song URL
      const promises = songUrls.map(async (songUrl, index) => {
        try {
          // Extract filename from URL for checking
          const filename = songUrl.split('/').pop() || '';
          const titleFromFilename = filename.replace(/\.[^/.]+$/, "");
          
          // Fetch the audio file first to get proper metadata
          const audioResponse = await fetch(songUrl);
          if (!audioResponse.ok) {
            console.warn(`Could not fetch ${songUrl}:`, audioResponse.statusText);
            return;
          }
          
          const blob = await audioResponse.blob();
          const file = new File([blob], filename, { type: 'audio/mpeg' });
          
          // Get metadata first to check for duplicates properly
          const metadata = await this.getAudioMetadata(file);
          const finalTitle = metadata.title || titleFromFilename;
          const finalArtist = metadata.artist || 'Unknown Artist';
          
          // Check if this song already exists in IndexedDB using title and artist
          const songExists = await this.songExistsByTitleAndArtist(finalTitle, finalArtist);
          if (songExists) {
            console.log(`Song "${finalTitle}" by "${finalArtist}" already exists in database, skipping...`);
            this.loadingProgress$.next({ current: index + 1, total: songUrls.length, message: `Skipped ${finalTitle}` });
            return;
          }
          
          // Get duration
          const duration = await this.getAudioDuration(file);
          
          const song: StoredSong = {
            id: this.generateId(),
            title: finalTitle,
            artist: finalArtist,
            src: URL.createObjectURL(file),
            totalTime: duration,
            blob: file
          };
          
          await this.songs.add(song);
          console.log(`Added default song: ${song.title} by ${song.artist}`);
          this.loadingProgress$.next({ current: index + 1, total: songUrls.length, message: `Added ${song.title}` });
          
        } catch (error) {
          console.error(`Error processing song ${songUrl}:`, error);
        }
      });
      
      await Promise.all(promises);
      await this.updateStorageInfo();
      this.loadingProgress$.next({ current: songUrls.length, total: songUrls.length, message: 'All default songs loaded.' });
      
    } catch (error) {
      console.error('Error loading default songs from playlist:', error);
    }
  }

  public async getPlaylistSongs(): Promise<Song[]> {
    const storedSongs = await this.songs.toArray();
    return storedSongs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      src: song.src,
      totalTime: song.totalTime
    }));
  }

  public async getBlobBySongId(songId: string): Promise<Blob | null> {
    const song = await this.songs.get(songId);
    return song?.blob || null;
  }

  public async deleteSong(songId: string): Promise<void> {
    await this.songs.delete(songId);
    await this.updateStorageInfo();
  }

  public async clearAllSongs(): Promise<void> {
    await this.songs.clear();
    await this.updateStorageInfo();
  }

  public async songExistsByTitleAndArtist(title: string, artist: string): Promise<boolean> {
    const existingSong = await this.songs
      .where('title').equals(title)
      .and(song => song.artist === artist)
      .first();
    return !!existingSong;
  }

  private async getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        resolve(0); // Default duration if unable to read
      };
      audio.src = URL.createObjectURL(file);
    });
  }

  private async getAudioMetadata(file: File): Promise<{title?: string, artist?: string}> {
    try {
      const metadata = await parseBlob(file);
      return {
        title: metadata.common.title,
        artist: metadata.common.artist
      };
    } catch (error) {
      console.warn('Failed to extract metadata:', error);
      return {};
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private async updateStorageInfo(): Promise<void> {
    await this.initializeStorageInfo();
  }
}
