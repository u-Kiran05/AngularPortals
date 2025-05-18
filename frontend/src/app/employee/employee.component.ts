import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee',
  standalone:false,
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss'
})
export class EmployeeComponent {
menuItems = [
    { icon: 'home', title: 'Home', link: '/employee/edashboard' },
    { icon: 'receipt_long', title: 'payslip', link: '/employee/payslip' },
    { icon: 'event_note', title: 'Leaves', link: '/employee/eleave' },
    
  ];
  constructor(private router: Router) {}

  onMenuItemClick(link: string) {
    this.router.navigateByUrl(link);
  }
}
