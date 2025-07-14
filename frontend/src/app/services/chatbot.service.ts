import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NlpResponse {
  intent: string;
  confidence: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private classifyUrl = 'http://localhost:3000/api/transformer-nlp';
  private shutdownUrl = 'http://localhost:3000/api/transformer-nlp/stop';

  constructor(private http: HttpClient) {}

  classifyIntent(message: string): Observable<NlpResponse> {
    return this.http.post<NlpResponse>(this.classifyUrl, { message });
  }

  shutdownNlp(): Observable<any> {
    return this.http.post(this.shutdownUrl, {});
  }
}
