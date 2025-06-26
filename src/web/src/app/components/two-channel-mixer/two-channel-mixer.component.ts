import { Component, input, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-two-channel-mixer',
  templateUrl: './two-channel-mixer.component.html',
  styleUrl: './two-channel-mixer.component.scss',
  imports: [FormsModule],
})
export class TwoChannelMixerComponent implements OnInit {
  public leftChannelLabel = input.required<string>();
  public leftChannelVolume = input.required<number>();
  public leftChannelVolumeChange = output<number>();

  public rightChannelLabel = input.required<string>();
  public rightChannelVolume = input.required<number>();
  public rightChannelVolumeChange = output<number>();

  public _crossFaderValue = 50;

  public ngOnInit() {
    this._crossFaderValue = this.computeCrossFaderValue();
    console.log('Crossfader Value: ', this._crossFaderValue);
  }

  public getLeftChannelVolume() {
    return Math.abs(this._crossFaderValue - 100);
  }

  public getRightChannelVolume() {
    return this._crossFaderValue;
  }

  // Events

  public onCrossFaderChange() {
    this.leftChannelVolumeChange.emit(this.getLeftChannelVolume());
    this.rightChannelVolumeChange.emit(this.getRightChannelVolume());
  }

  // Helpers

  private computeCrossFaderValue() {
    if (this.leftChannelVolume() === 0) {
      return 0;
    }
    if (this.rightChannelVolume() === 0) {
      return 100;
    }
    return (this.rightChannelVolume() / (this.leftChannelVolume() + this.rightChannelVolume())) * 100;
  }
}
