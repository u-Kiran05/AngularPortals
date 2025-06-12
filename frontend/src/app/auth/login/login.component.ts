import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { VendorService } from '../../services/vendor/vendor.service';
import { CustomerService } from '../../services/customer/customer.service';
import { EmployeeService } from '../../services/employee/employee.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  selectedUser: string = '';
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private cuService: CustomerService,
    private vService: VendorService,
    private empService: EmployeeService
  ) {}

  setUser(type: string) {
    this.selectedUser = type;
  }

  onLogin() {
    if (!this.selectedUser || !this.username || !this.password) {
      alert('Please select user type and fill in all fields.');
      return;
    }

    console.debug('[LoginComponent] Attempting login as:', this.selectedUser);

    if (this.selectedUser === 'Customer') {
      this.cuService.validateCustomerLogin(this.username, this.password).subscribe(
        (res) => {
          if (res.success && res.token) {
            this.authService.setUserInfo({
              id: this.username,
              name: this.username,
              role: 'Customer',
              lastLogin: new Date().toISOString(),
              token: res.token
            });
            this.router.navigate(['/customer']);
          } else {
            alert('Invalid Customer ID or Password.');
          }
        },
        (err) => {
          console.error('[LoginComponent] Customer login failed:', err);
          alert('Login request failed. Please try again later.');
        }
      );
    } else if (this.selectedUser === 'Vendor') {
      this.vService.validateVendorLogin(this.username, this.password).subscribe(
        (res) => {
          if (res.status === 'Y' && res.token) {
            this.authService.setUserInfo({
              id: this.username,
              name: this.username,
              role: 'Vendor',
              lastLogin: new Date().toISOString(),
              token: res.token
            });
            this.router.navigate(['/vendor']);
          } else {
            alert('Invalid Vendor ID or Password.');
          }
        },
        (err) => {
          console.error('[LoginComponent] Vendor login failed:', err);
          alert('Login request failed. Please try again later.');
        }
      );
    } else if (this.selectedUser === 'Employee') {
      this.empService.validateEmployeeLogin(this.username, this.password).subscribe(
        (res) => {
          if (res.success && res.token) {
            this.authService.setUserInfo({
              id: this.username,
              name: this.username,
              role: 'Employee',
              lastLogin: new Date().toISOString(),
              token: res.token
            });
            this.router.navigate(['/employee']);
          } else {
            alert('Invalid Employee ID or Password.');
          }
        },
        (err) => {
          console.error('[LoginComponent] Employee login failed:', err);
          alert('Login request failed. Please try again later.');
        }
      );
    } else {
      alert('Invalid user type selected.');
    }
  }
}
