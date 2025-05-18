import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone:false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUserInfo();
  }
}
