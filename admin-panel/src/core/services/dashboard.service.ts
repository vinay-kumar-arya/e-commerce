import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;
  constructor(private http: HttpClient) {}
  getProducts(): Observable<any> {
    const url = `${this.apiUrl}/productsDetails`;
    return this.http.get<any>(url);
  }
  getUsers(): Observable<any> {
    const url = `${this.apiUrl}/usersdetails`;
    return this.http.get<any>(url);
  }

  getOrders(): Observable<any> {
    const url = `${this.apiUrl}/ordersdetails`;
    return this.http.get<any>(url);
  }
  getCategory(): Observable<any> {
    const url = `${this.apiUrl}/categoriesdetails`;
    return this.http.get<any>(url);
  }
}
