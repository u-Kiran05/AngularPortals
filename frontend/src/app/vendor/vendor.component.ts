import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vendor',
  standalone:false,
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
menuItems = [
  { icon: 'home', title: 'Home', link: '/vendor/vdashboard' },
  { icon: 'request_quote', title: 'Quotations', link: '/vendor/vquotation' },
  { icon: 'assignment', title: 'Purchase Orders', link: '/vendor/vpurchase' },
  { icon: 'inventory_2', title: 'Goods Receipt', link: '/vendor/vgoods' },
  { icon: 'receipt_long', title: 'Vendor Invoices', link: '/vendor/vinvoice' },
  { icon: 'event_repeat', title: 'Vendor Aging', link: '/vendor/vaging' },
  { icon: 'sync_alt', title: 'Credit/Debit Viewer', link: '/vendor/vcandd' } 
];
  constructor(private router: Router) {}

  onMenuItemClick(link: string) {
    this.router.navigateByUrl(link);
  }
}
