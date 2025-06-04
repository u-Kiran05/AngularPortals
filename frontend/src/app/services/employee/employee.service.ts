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
}
