import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarouselService {
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  uploadImages(formData: any) {
    return this.http.post(`${this.apiUrl}/uploads/create`, formData);
  }

  getImages() {
    return this.http.get<{ images: string[] }>(`${this.apiUrl}/uploads/get`);
  }
}
