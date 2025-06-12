import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const user = this.authService.getUserInfo();

    if (user && (!expectedRole || user.role === expectedRole)) {
      return true;
    } else {
      alert('Access denied.');
      this.authService.clearUserInfo();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
