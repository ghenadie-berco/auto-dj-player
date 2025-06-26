import { Component, output } from '@angular/core';
import { Song } from '../../app.interfaces';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-playlist',
  imports: [NgClass],
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {

  public loadToDeckA = output<Song>();
  public loadToDeckB = output<Song>();

  public songs: Song[] = [
    { title: 'Test 1', src: 'assets/test1.mp3' },
    { title: 'Test 2', src: 'assets/test2.mp3' },
  ];

  public selectedSong: Song | null = null;

  public onLoadToDeckA() {
    this.loadToDeckA.emit(this.selectedSong!);
  }

  public onLoadToDeckB() {
    this.loadToDeckB.emit(this.selectedSong!);
  }

}
