import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { AutoDjComponent } from './components/auto-dj/auto-dj.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: { class: 'view flex-col' },
  imports: [
    HeaderComponent,
    AutoDjComponent,
    FooterComponent,
  ],
})
export class AppComponent {}
