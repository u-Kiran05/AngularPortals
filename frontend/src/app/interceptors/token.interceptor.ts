import { Injectable } from '@angular/core';
import {HttpInterceptor,HttpRequest,HttpHandler,HttpEvent} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const path = window.location.pathname;
    let role = '';

    if (path.includes('/vendor')) role = 'vendor';
    else if (path.includes('/customer')) role = 'customer';
    else if (path.includes('/employee')) role = 'employee';

    const user = JSON.parse(sessionStorage.getItem(`${role}Info`) || '{}');
    const token = user?.token;

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
