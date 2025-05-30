import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: any = null;

  constructor(private http: HttpClient) {
    // Load user info from localStorage
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

  // Example of using stored user info in a service call
  getCustomerProfile(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/profile', {
      customerId: user.id
    });
  }
  getCustomerCandD(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/cand', {
      customerId: user.id
    });
  }
  getCustomerAging(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/aging', {
      customerId: user.id
    });
  }
    getCustomerOverallSales(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/overallSales', {
      customerId: user.id
    });
  }
    downloadInvoicePDF(vbeln: string): Observable<Blob> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    const customerId = user.id; // Retrieved from AuthService

    return this.http.post('http://localhost:3000/api/customer/invoice/download', 
      { customerId, vbeln }, 
      { responseType: 'blob' } // Important: expects binary Blob
    );
  }

  getCustomerSales(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/sales', {
      customerId: user.id
    });
  }
 getCustomerBI(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/customerbi', {
      customerId: user.id
    });
  }
  getCustomerInquiries(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/inquiry', {
      customerId: user.id
    });
  }

  getCustomerDeliveries(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/delivery', {
      customerId: user.id
    });
  }

  getCustomerInvoices(): Observable<any> {
    const user = this.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return this.http.post('http://localhost:3000/api/customer/invoice', {
      customerId: user.id
    });
  }
  
}
