import { Component } from '@angular/core';
import { AutoDjComponent } from './components/auto-dj/auto-dj.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [AutoDjComponent],
})
export class AppComponent {}
