import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private apiUrl = `${environment.apiUrl}/category`;
  constructor(private http: HttpClient) {}

  category(page: number, searchParams: any): Observable<any> {
    // const query = new URLSearchParams(params as any);
    const url = `${this.apiUrl}/get?page=${page}&search=${searchParams}`;
    return this.http.get<any>(url);
  }

  addCategory(data: any): Observable<any> {
    const payload = { ...data };
    delete payload.status;
    return this.http.post<any>(`${this.apiUrl}/create`, payload);
  }

  update(_id: string, data: any): Observable<any> {
    const payload = { ...data };
    delete payload._id;

    return this.http.put<any>(`${this.apiUrl}/update/${_id}`, payload);
  }
  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }

  fetchCategoryList(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getList`);
  }
}
