import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer/customer.service';  // Updated import
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileCardComponent implements OnInit {
  @Input() showProfileCard: boolean = false;
  user: any;
  customerProfile: any;

  constructor(private authService: AuthService, private cuService: CustomerService) {}  // Updated constructor

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();

    if (this.user?.role === 'Customer') {
      this.cuService.getCustomerProfile().subscribe(
        (profile) => this.customerProfile = profile,
        () => this.customerProfile = null
      );
    }
  }

  getRoleIcon(): string {
    const role = this.user?.role?.toLowerCase();
    if (role === 'vendor') return 'store';
    if (role === 'employee') return 'engineering';
    return 'person';
  }
}
