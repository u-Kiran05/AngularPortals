import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  profile: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();

    if (this.user?.role === 'Customer') {
      this.authService.getCustomerProfile(this.user.id).subscribe(
        (data) => {
          this.profile = data;
        },
        () => {
          this.profile = null;
          alert('Failed to fetch customer profile.');
        }
      );
    }
  }
}
