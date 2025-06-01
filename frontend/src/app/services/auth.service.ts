import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: any = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      this.userInfo = JSON.parse(storedUser);
    }
  }

  setUserInfo(user: any) {
    this.userInfo = user;
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  getUserInfo() {
    if (!this.userInfo) {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        this.userInfo = JSON.parse(storedUser);
      }
    }
    return this.userInfo;
  }

  clearUserInfo() {
    this.userInfo = null;
    localStorage.removeItem('userInfo');
  }

  isLoggedIn() {
    return !!this.getUserInfo();
  }

  validateCustomerLogin(customerId: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/login', { customerId, password });
  }
}
