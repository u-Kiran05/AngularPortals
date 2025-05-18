import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone:false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'SAP-EPR-PORTAL';

  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
}
