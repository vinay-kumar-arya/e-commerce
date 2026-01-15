import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}
  users(page: number, searchParams: any): Observable<any> {
    // const query = new URLSearchParams(params as any);
    const url = `${this.apiUrl}/getUsers?page=${page}&search=${searchParams}`;
    return this.http.get<any>(url);
  }
  update(data: { _id: String; name: string; status: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateUser`, data);
  }
  searchUsers(params: { [key: string]: string }) {
    const query = new URLSearchParams(params).toString();
    return this.http.get<any>(`${this.apiUrl}/getUsers?${query}`);
  }
  addUser(credentials: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addUser`, credentials);
  }
  deleteUserAcc(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteUser/${id}`);
  }
}
