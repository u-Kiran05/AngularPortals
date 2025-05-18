import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone:false,
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {
  menuItems = [
    { icon: 'home', title: 'Home', link: '/customer/cdashboard' },
    { icon: 'question_answer', title: 'Inquiry', link: '/customer/inquiry' },
    { icon: 'receipt_long', title: 'Sales Order', link: '/customer/sales' },
    { icon: 'local_shipping', title: 'Delivery', link: '/customer/delivery' },
    { icon: 'request_quote', title: 'Invoice', link: '/customer/invoice' },
    { icon: 'payments', title: 'Payments', link: '/customer/payment' },
    { icon: 'credit_score', title: 'Credit/Debit ', link: '/customer/credit' }
  ];

  constructor(private router: Router) {}

  onMenuItemClick(link: string) {
    this.router.navigateByUrl(link);
  }
}
