import { Injectable } from '@angular/core';
import { Dexie, Table } from 'dexie';
import { Song } from '../../components/auto-dj/auto-di.interfaces';
import * as jsmediatags from 'jsmediatags';

interface StoredSong extends Song {
  blob: Blob;
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService extends Dexie {
  songs!: Table<StoredSong>;
  
  public totalCapacityMB: number = 0;
  public availableSpaceMB: number = 0;

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
        this.totalCapacityMB = Math.floor((estimate.quota || 0) / (1024 * 1024));
        this.availableSpaceMB = Math.floor(((estimate.quota || 0) - (estimate.usage || 0)) / (1024 * 1024));
      }
    } catch (error) {
      console.warn('Storage estimation not available:', error);
    }
  }

  public async loadFilesToIndexedDB(files: FileList): Promise<void> {
    const promises = Array.from(files).map(async (file) => {
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
      }
    });
    
    await Promise.all(promises);
    await this.updateStorageInfo();
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
    return new Promise((resolve) => {
      jsmediatags.read(file, {
        onSuccess: (tag) => {
          const tags = tag.tags;
          resolve({
            title: tags.title,
            artist: tags.artist
          });
        },
        onError: () => {
          resolve({});
        }
      });
    });
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private async updateStorageInfo(): Promise<void> {
    await this.initializeStorageInfo();
  }
}
