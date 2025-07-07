import { Component, output } from '@angular/core';

@Component({
  selector: 'app-play-button',
  imports: [],
  templateUrl: './play-button.component.html',
  styleUrl: './play-button.component.scss'
})
export class PlayButtonComponent {

  public play = output<void>();

}
