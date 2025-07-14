import { Component, OnDestroy } from '@angular/core';
import { ChatbotService, NlpResponse } from '../../services/chatbot.service';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  styleUrl: './chatbot.component.scss',
  templateUrl: './chatbot.component.html'
})
export class ChatbotComponent implements OnDestroy {
  isOpen = false;
  chatMessages: { text: string, sender: 'user' | 'bot' }[] = [];
  userInput = '';
  showIntro1 = true;
  showIntro2 = true;
  hideBubbles = false;

  constructor(
    private chatbotService: ChatbotService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.hideBubbles = true;

    if (!this.isOpen) {
      this.chatbotService.shutdownNlp().subscribe({
        next: () => console.log('NLP shutdown triggered'),
        error: () => console.warn('NLP shutdown failed or already off')
      });
    }
  }

  sendMessage() {
    const message = this.userInput.trim();
    if (!message) return;

    this.chatMessages.push({ text: message, sender: 'user' });
    this.userInput = '';

    this.chatbotService.classifyIntent(message).subscribe({
      next: (res: NlpResponse) => {
        this.chatMessages.push({
          text: this.generateBotReply(res.intent, res.confidence, message),
          sender: 'bot'
        });
      },
      error: () => {
        this.chatMessages.push({
          text: 'server is offline. Please try again later.',
          sender: 'bot'
        });
      }
    });
  }

  generateBotReply(intent: string, confidence: number, userInput: string): string {
    if (confidence < 0.05) {
      return "I'm not sure what you meant. Can you rephrase?";
    }

    switch (intent) {
      // Employee routes
      case 'employee.open.dashboard':
        this.router.navigate(['/employee/edashboard']);
        return "Opening your employee dashboard.";
      case 'employee.open.leave':
        this.router.navigate(['/employee/eleave']);
        return "Here’s your leave overview.";
      case 'employee.open.payslip':
        this.router.navigate(['/employee/epay']);
        return "Sure! Opening your payslip...";
      case 'employee.email.payslip': {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/;
        const emailMatch = userInput.match(emailRegex);

        if (emailMatch) {
          const email = emailMatch[0];
          this.employeeService.sendPayslipEmail(email).subscribe({
            next: (res) => {
              console.log('Payslip email sent:', res);
              this.chatMessages.push({
                text: "Payslip sent to " + email,
                sender: 'bot'
              });
            },
            error: (err) => {
              console.error('Failed to send payslip email:', err);
              this.chatMessages.push({
                text: " Failed to send payslip. Please try again.",
                sender: 'bot'
              });
            }
          });
          return "Sending your payslip to " + email + "...";
        } else {
          return "Please include a valid email address in your message (e.g., diaz@example.com).";
        }
      }

      // Customer routes
      case 'customer.open.dashboard':
        this.router.navigate(['/customer/cdashboard']);
        return "Welcome to your customer dashboard.";
      case 'customer.open.profile':
        this.router.navigate(['/profile']);
        return "Here's your profile.";
      case 'customer.open.inquiries':
        this.router.navigate(['/customer/inquiry']);
        return "Fetching your sales inquiries.";
      case 'customer.open.deliveries':
        this.router.navigate(['/customer/delivery']);
        return "Here are your deliveries.";
      case 'customer.open.sales':
        this.router.navigate(['/customer/sales']);
        return "Accessing your sales orders.";
      case 'customer.open.invoices':
        this.router.navigate(['/customer/invoice']);
        return "Showing your invoices.";
      case 'customer.download.invoicepdf':
        this.router.navigate(['/customer/invoice']);
        return "Downloading your invoice PDF...";
      case 'customer.open.aging':
        this.router.navigate(['/customer/payment']);
        return "Showing your aging/payment report.";
      case 'customer.open.candd':
        this.router.navigate(['/customer/credit']);
        return "Accessing your credit/debit notes.";
      case 'customer.open.overallsales':
        this.router.navigate(['/customer/ovsales']);
        return "Showing your overall sales.";
      case 'customer.open.bi':
        this.router.navigate(['/customer/cdashboard']);
        return "Opening your BI dashboard.";

      // Vendor routes
      case 'vendor.open.dashboard':
        this.router.navigate(['/vendor/vdashboard']);
        return "Opening your vendor dashboard.";
      case 'vendor.open.profile':
        this.router.navigate(['/profile']);
        return "Here’s your vendor profile.";
      case 'vendor.open.purchase':
        this.router.navigate(['/vendor/vpurchase']);
        return "Fetching your purchase orders.";
      case 'vendor.open.quotation':
        this.router.navigate(['/vendor/vquotation']);
        return "Showing your RFQs.";
      case 'vendor.open.invoice':
        this.router.navigate(['/vendor/vinvoice']);
        return "Here are your vendor invoices.";
      case 'vendor.open.goods':
        this.router.navigate(['/vendor/vgoods']);
        return "Displaying goods receipts.";
      case 'vendor.open.aging':
        this.router.navigate(['/vendor/vaging']);
        return "Opening vendor aging report.";
      case 'vendor.open.candd':
        this.router.navigate(['/vendor/vcandd']);
        return "Accessing credit & debit memos.";
      case 'vendor.open.bi':
        this.router.navigate(['/vendor/vdashboard']);
        return "Launching vendor analytics dashboard.";

      // Default fallback
      default:
        return `I detected: ${intent}, but I’m not sure where to navigate.`;
    }
  }

  ngOnDestroy(): void {
    this.chatbotService.shutdownNlp().subscribe();
  }
}
