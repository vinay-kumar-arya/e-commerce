import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /**
   * Sends OTP to user email
   */
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  /**
   * Resets the password after OTP verification
   */
  resetPassword(data: {
    email: any;
    otp: any;
    password: any;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }
}
