import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  get<T>(url: string, params?: Record<string, string | number | boolean>) {
    return this.http.get<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, { params });
  }

  post<T, B>(url: string, body: B) {
    return this.http.post<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, body);
  }

  put<T, B>(url: string, body: B) {
    return this.http.put<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`, body);
  }

  delete<T>(url: string) {
    return this.http.delete<ApiResponse<T>>(`${environment.apiBaseUrl}${url}`);
  }
}
