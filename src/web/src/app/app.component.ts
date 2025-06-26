import { Component, viewChild } from '@angular/core';
import { AudioTrackPlayerComponent } from './components/audio-track-player/audio-track-player.component';
import { TwoChannelMixerComponent } from './components/two-channel-mixer/two-channel-mixer.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { Song } from './app.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    AudioTrackPlayerComponent,
    TwoChannelMixerComponent,
    PlaylistComponent,
  ],
})
export class AppComponent {
  public title = 'web';

  public playerARef = viewChild<AudioTrackPlayerComponent>('playerA');
  public playerBRef = viewChild<AudioTrackPlayerComponent>('playerB');
  public mixerRef = viewChild<TwoChannelMixerComponent>('mixer');

  public onLoadToDeckA(song: Song) {
    const deckAVolume = this.mixerRef()?.getLeftChannelVolume() ?? 0;
    this.playerARef()?.loadNewTrack(song, deckAVolume);
  }

  public onLoadToDeckB(song: Song) {
    const deckBVolume = this.mixerRef()?.getRightChannelVolume() ?? 0;
    this.playerBRef()?.loadNewTrack(song, deckBVolume);
  }

  public onMixerLeftChannelVolumeChange(volume: number) {
    this.playerARef()?.setVolume(volume);
  }

  public onMixerRightChannelVolumeChange(volume: number) {
    this.playerBRef()?.setVolume(volume);
  }
}
