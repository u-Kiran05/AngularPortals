import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get vendorId(): string {
    const user = this.authService.getUserInfo();
    if (!user || !user.id || user.role !== 'Vendor') {
      throw new Error('Vendor not logged in');
    }
    return user.id;
  }

  validateVendorLogin(vendorId: string, password: string): Observable<{ status: string; token: string }> {
    return this.http.post<{ status: string; token: string }>('http://localhost:3000/api/vendor/login', {
      vendorId,
      password
    });
  }

  getVendorProfile(): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/api/vendor/vprofile/${this.vendorId}`);
  }

  getVendorPurchaseOrders(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/vendor/Vorders/${this.vendorId}`);
  }

  getVendorQuotations(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/vendor/vquotation/${this.vendorId}`);
  }

  getVendorGoodsReceipts(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/vendor/vgoods/${this.vendorId}`);
  }

  downloadVendorInvoicePDF(belnr: string): Observable<Blob> {
    return this.http.get(`http://localhost:3000/api/vendor/vinvpdf/${this.vendorId}/${belnr}`, {
      responseType: 'blob'
    });
  }

  getVendorInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/vendor/Vinvoice/${this.vendorId}`);
  }

 getVendorCreditDebit(): Observable<{ credit: any[], debit: any[] }> {
  return this.http.get<{ credit: any[], debit: any[] }>(`http://localhost:3000/api/vendor/vcandd/${this.vendorId}`);
}

  getVendorAging(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/vendor/vaging/${this.vendorId}`);
  }
  getVendorBIData(): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/api/vendor/vbi/${this.vendorId}`);
}

}
