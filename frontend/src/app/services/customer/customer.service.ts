// customer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get customerId(): string {
    const user = this.authService.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return user.id;
  }

  validateCustomerLogin(customerId: string, password: string): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/login', { customerId, password });
  }

  getCustomerProfile(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/profile', { customerId: this.customerId });
  }

  getCustomerCandD(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/cand', { customerId: this.customerId });
  }

  getCustomerAging(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/aging', { customerId: this.customerId });
  }

  getCustomerOverallSales(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/overallSales', { customerId: this.customerId });
  }

  downloadInvoicePDF(vbeln: string): Observable<Blob> {
    return this.http.post('http://localhost:3000/api/customer/invoice/download', 
      { customerId: this.customerId, vbeln }, 
      { responseType: 'blob' }
    );
  }

  getCustomerSales(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/sales', { customerId: this.customerId });
  }

  getCustomerBI(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/customerbi', { customerId: this.customerId });
  }

  getCustomerInquiries(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/inquiry', { customerId: this.customerId });
  }

  getCustomerDeliveries(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/delivery', { customerId: this.customerId });
  }

  getCustomerInvoices(): Observable<any> {
    return this.http.post('http://localhost:3000/api/customer/invoice', { customerId: this.customerId });
  }
}
