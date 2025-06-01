import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer/customer.service';
@Component({
  selector: 'app-login',
  standalone:false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  selectedUser: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private cuService:CustomerService) {}

  setUser(type: string) {
    this.selectedUser = type;
  }

  onLogin() {
  if (!this.selectedUser || !this.username || !this.password) {
    alert('Please select user type and fill in all fields.');
    return;
  }

  if (this.selectedUser === 'Customer') {
    // Call backend to validate customer login
    this.cuService.validateCustomerLogin(this.username, this.password).subscribe(
      (res) => {
        if (res.success) {
          this.authService.setUserInfo({
            id: this.username,
            name: this.username,
            role: this.selectedUser,
            lastLogin: new Date().toISOString(),
          });
          this.router.navigate(['/customer']);
        } else {
          alert('Invalid Customer ID or Password.');
        }
      },
      () => alert('Login request failed. Please try again later.')
    );
  } else {
    // Fallback for other user types
    this.authService.setUserInfo({
      id: this.username,
      name: this.username,
      role: this.selectedUser,
      lastLogin:  new Date().toISOString(),
    });

    switch (this.selectedUser) {
      case 'Vendor':
        this.router.navigate(['/vendor']);
        break;
      case 'Employee':
        this.router.navigate(['/employee']);
        break;
      default:
        alert('Invalid user type selected.');
    }
  }
}

}
