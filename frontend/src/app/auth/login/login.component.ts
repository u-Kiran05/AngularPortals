import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { VendorService } from '../../services/vendor/vendor.service';
import { CustomerService } from '../../services/customer/customer.service';
import { EmployeeService } from '../../services/employee/employee.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
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
    private empService: EmployeeService,
    private snackBar: MatSnackBar
  ) {}

  setUser(type: string) {
    this.selectedUser = type;
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'ok', {
      duration: 4000,
      panelClass: [`${type}-snackbar`]
    });
  }

  onLogin() {
    if (!this.selectedUser || !this.username || !this.password) {
      this.showMessage('Fill all ', 'error');
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
          this.showMessage('Customer login successful!','success');
            this.router.navigate(['/customer']);
          } else {
            this.showMessage('Invalid Customer ID or Password.', 'error');
          }
        },
        (err) => {
          console.error('[LoginComponent] Customer login failed:', err);
          this.showMessage('Login request failed. Please try again later.', 'error');
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
          //this.showMessage('Vendor login successful!', 'success');
            this.router.navigate(['/vendor']);
          } else {
            this.showMessage('Invalid Vendor ID or Password.', 'error');
          }
        },
        (err) => {
          console.error('[LoginComponent] Vendor login failed:', err);
          this.showMessage('Login request failed. Please try again later.', 'error');
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
          this.showMessage('Employee login successful!', 'success');
            this.router.navigate(['/employee']);
          } else {
            this.showMessage('Invalid Employee ID or Password.', 'error');
          }
        },
        (err) => {
          console.error('[LoginComponent] Employee login failed:', err);
          this.showMessage('Login request failed. Please try again later.', 'error');
        }
      );
    } else {
      this.showMessage('Invalid user type selected.', 'error');
    }
  }
}
