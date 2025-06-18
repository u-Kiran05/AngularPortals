import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  private get employeeId(): string {
    const user = this.authService.getUserInfo();
    if (!user || !user.id) {
      throw new Error('User not logged in');
    }
    return user.id;
  }

  validateEmployeeLogin(employeeId: string, password: string): Observable<{ success: boolean; token: string }> {
    return this.http.post<{ success: boolean; token: string }>('http://localhost:3000/api/employee/login', {
      employeeId,
      password
    });
  }

  getEmployeeProfile(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/employee/eprofile', {
      employeeId: this.employeeId
    });
  }

  getEmployeeLeave(): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/employee/eleave', {
      employeeId: this.employeeId
    });
  }

  getEmployeePayslip(): Observable<any> {
  return this.http.post<any>('http://localhost:3000/api/employee/payslip', {
    employeeId: this.employeeId
  });
}

downloadPayslipPDF(): Observable<Blob> {
  return this.http.post('http://localhost:3000/api/employee/payslip/download', {
    employeeId: this.employeeId
  }, { responseType: 'blob' });
}
sendPayslipEmail(to: string): Observable<any> {
  return this.http.post<any>('http://localhost:3000/api/employee/sendemail', {
    employeeId: this.employeeId,
    to
  });
}


}
