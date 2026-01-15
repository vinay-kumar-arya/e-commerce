import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private apiUrl = `${environment.apiUrl}/order`;
  constructor(private http: HttpClient) {}

  orders(page: number, searchParams: any): Observable<any> {
    // const query = new URLSearchParams(params as any);
    const url = `${this.apiUrl}/getAll?page=${page}&search=${searchParams}`;
    return this.http.get<any>(url);
  }
  update(_id: string, data: any): Observable<any> {
    const payload = { ...data };

    return this.http.put<any>(`${this.apiUrl}/update/${_id}`, payload);
  }

  // addProduct(data: any): Observable<any> {
  //   const payload = { ...data };
  //   delete payload.status;
  //   return this.http.post<any>(`${this.apiUrl}/create`, payload);
  // }
  // deleteProduct(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  // }
}
