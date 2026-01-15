import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/product`;
  constructor(private http: HttpClient) {}
  products(page: number, searchParams: any): Observable<any> {
    // const query = new URLSearchParams(params as any);
    const url = `${this.apiUrl}/get?page=${page}&search=${searchParams}`;
    return this.http.get<any>(url);
  }
  update(_id: string, data: any): Observable<any> {
    // const payload = { ...data };
    // delete payload._id;
    // console.log(payload);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryName', data.categoryName);
    formData.append('price', data.price);
    formData.append('status', 'active');
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }

    return this.http.put<any>(`${this.apiUrl}/update/${_id}`, formData);
  }

  addProduct(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryName', data.categoryName);
    formData.append('price', data.price);
    formData.append('status', 'active');
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    // const payload = { ...data };
    // delete payload.status;
    // if(payload.image instanceof File){
    //   payload.image=
    // }
    return this.http.post<any>(`${this.apiUrl}/create`, formData);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`);
  }
}
