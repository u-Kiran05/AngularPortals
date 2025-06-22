// src/app/services/sap-status.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SapStatus {
  up: boolean;
  message: string;
  lastChecked: string;
}

@Injectable({
  providedIn: 'root'
})
export class SapStatusService {

  private apiUrl = 'http://localhost:3000/api/sap-status'; 

  constructor(private http: HttpClient) {}

  getStatus(): Observable<SapStatus> {
    return this.http.get<SapStatus>(this.apiUrl);
  }
}
