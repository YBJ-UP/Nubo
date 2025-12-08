import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  // Base URL provista por environment.ts
  private readonly baseUrl: string = environment.apiUrl;

  /**
   * Construye la URL completa a partir del endpoint.
   * El endpoint puede o no comenzar con '/'.
   */
  getFullUrl(endpoint: string): string {
    const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${normalized}`;
  }

  /**
   * Cabeceras comunes para todas las peticiones.
   */
  /**
   * Cabeceras compatibles con HttpClient (Record<string,string>)
   */
  getHttpHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }


  getAuthHeaders(token?: string): HeadersInit {
    const headers = this.getHttpHeaders();
    if (token) {
      return { ...headers, Authorization: `Bearer ${token}` };
    }
    const storedToken = localStorage.getItem('teacher_token');
    if (storedToken) {
      return { ...headers, Authorization: `Bearer ${storedToken}` };
    }
    return headers;
  }
}