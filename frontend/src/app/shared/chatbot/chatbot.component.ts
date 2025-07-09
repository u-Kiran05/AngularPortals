import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent {
  isOpen = false;
  showIntro1 = false;
  showIntro2 = false;
  hideBubbles = false;

  ngOnInit(): void {
    setTimeout(() => (this.showIntro1 = true), 1000);
    setTimeout(() => (this.showIntro2 = true), 2500);


    setTimeout(() => {
      this.hideBubbles = true;
    }, 10000);


    setTimeout(() => {
      this.showIntro1 = false;
      this.showIntro2 = false;
      this.hideBubbles = false;
    }, 10500);
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    this.showIntro1 = false;
    this.showIntro2 = false;
    this.hideBubbles = false;
  }
}
