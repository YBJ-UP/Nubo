import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl: string = environment.apiUrl || 'http://54.226.246.30:9000';

  constructor(private http: HttpClient) {
    console.log('API Base URL:', this.baseUrl);
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getEndpoint(endpoint: string): string {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${normalizedEndpoint}`;
  }

  async checkApiHealth(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.get(this.getEndpoint('/health'), {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        })
      );
      return true;
    } catch (error) {
      console.warn('API no disponible:', error);
      return false;
    }
  }

  getCommonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  getAuthHeaders(token?: string): HttpHeaders {
    let headers = this.getCommonHeaders();
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      const storedToken = localStorage.getItem('teacher_token');
      if (storedToken) {
        headers = headers.set('Authorization', `Bearer ${storedToken}`);
      }
    }
    
    return headers;
  }

  get<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.get<T>(this.getEndpoint(endpoint), {
      ...options,
      headers: options?.headers || this.getCommonHeaders()
    });
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.post<T>(this.getEndpoint(endpoint), body, {
      ...options,
      headers: options?.headers || this.getCommonHeaders()
    });
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    return this.http.put<T>(this.getEndpoint(endpoint), body, {
      ...options,
      headers: options?.headers || this.getCommonHeaders()
    });
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    return this.http.delete<T>(this.getEndpoint(endpoint), {
      ...options,
      headers: options?.headers || this.getCommonHeaders()
    });
  }
}