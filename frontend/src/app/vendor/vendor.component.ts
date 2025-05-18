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
    { icon: 'attach_money', title: 'finance', link: '/vendor/vfinance' },
    
  ];
  constructor(private router: Router) {}

  onMenuItemClick(link: string) {
    this.router.navigateByUrl(link);
  }
}
