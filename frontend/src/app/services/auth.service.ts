// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: any = null;

  setUserInfo(user: any) {
    this.userInfo = user;
  }

  getUserInfo() {
    return this.userInfo;
  }
}
