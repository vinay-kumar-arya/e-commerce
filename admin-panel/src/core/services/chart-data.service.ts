import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments.';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  private apiUrl = `${environment.apiUrl}/graph`;

  constructor(private http: HttpClient) {}
  chartData(data: string) {
    const url = `${this.apiUrl}/${data}Graph`;
    return this.http.get<any>(url);
  }
}
