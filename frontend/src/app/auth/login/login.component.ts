import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  setUser(type: string) {
    this.selectedUser = type;
  }

  onLogin() {
    if (!this.selectedUser || !this.username || !this.password) {
      alert('Please select user type and fill in all fields.');
      return;
    }

    // Save user info
    this.authService.setUserInfo({
      id: this.username,
      name: this.username,
      role: this.selectedUser,
      lastLogin: new Date()
    });

    // Navigate based on user type
    switch (this.selectedUser) {
      case 'Customer':
        this.router.navigate(['/customer']);
        break;
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
