import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class GetAdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}
  admin(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAdmin`);
  }
  update(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update`, data);
  }
}
