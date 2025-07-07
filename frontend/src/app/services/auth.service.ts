import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: any = null;

  constructor(private http: HttpClient) {
    this.userInfo = this.loadUserFromStorage();
  }

  private getCurrentRoleFromPath(): string {
    const path = window.location.pathname;
    if (path.includes('/vendor')) return 'vendor';
    if (path.includes('/customer')) return 'customer';
    if (path.includes('/employee')) return 'employee';
    return '';
  }

  private loadUserFromStorage(): any {
    const role = this.getCurrentRoleFromPath();
    const stored = sessionStorage.getItem(`${role}Info`);
    return stored ? JSON.parse(stored) : null;
  }

  setUserInfo(user: any) {
    const role = user.role?.toLowerCase();

    // Clear other roles from sessionStorage (per tab)
    ['vendor', 'customer', 'employee'].forEach(r => {
      if (r !== role) sessionStorage.removeItem(`${r}Info`);
    });

    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem(`${role}Info`, JSON.stringify(user));
    if (user.token) {
      sessionStorage.setItem('token', user.token);
    }

    this.userInfo = user;
  }
getCurrentUserRole(): string {
  const info = this.getUserInfo();
  return info?.role?.toLowerCase() || this.getCurrentRoleFromPath();
}
  getUserInfo(): any {
    if (!this.userInfo) {
      this.userInfo = this.loadUserFromStorage();
    }
    return this.userInfo;
  }

  getToken(): string | null {
    return this.getUserInfo()?.token || sessionStorage.getItem('token') || null;
  }

  clearUserInfo() {
    this.userInfo = null;
    ['user', 'vendorInfo', 'customerInfo', 'employeeInfo', 'token'].forEach(key =>
      sessionStorage.removeItem(key)
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
