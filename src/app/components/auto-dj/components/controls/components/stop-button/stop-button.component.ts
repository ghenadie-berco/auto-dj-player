import { Component, output } from '@angular/core';

@Component({
  selector: 'app-stop-button',
  imports: [],
  templateUrl: './stop-button.component.html',
  styleUrl: './stop-button.component.scss'
})
export class StopButtonComponent {

  public stop = output<void>();

}
