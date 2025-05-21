import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: any = null;

  constructor(private http: HttpClient) {}

  setUserInfo(user: any) {
    this.userInfo = user;
  }

  getUserInfo() {
    return this.userInfo;
  }

    getCustomerProfile(customerId: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/profile', {
      customerId
    });
  }
  getCustomerSales(customerId: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/sales', {
      customerId
    });
  }
  getCustomerInquiries(customerId: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/inquiry', {
      customerId
    });
  }
  validateCustomerLogin(customerId: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/login', {
      customerId,
      password
    });
  }
}
