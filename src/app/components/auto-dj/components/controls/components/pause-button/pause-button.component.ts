import { Component, output } from '@angular/core';

@Component({
  selector: 'app-pause-button',
  imports: [],
  templateUrl: './pause-button.component.html',
  styleUrl: './pause-button.component.scss'
})
export class PauseButtonComponent {

  public pause = output<void>();

}
