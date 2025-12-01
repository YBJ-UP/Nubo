import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private readonly baseUrl: string = environment.apiUrl || 'http://localhost:9000';

  constructor() {
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
      const response = await fetch(this.getEndpoint('/health'), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.warn('API no disponible:', error);
      return false;
    }
  }

  getCommonHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = this.getCommonHeaders();
    
    if (token) {
      return {
        ...headers,
        'Authorization': `Bearer ${token}`
      };
    }
    
    const storedToken = localStorage.getItem('teacher_token');
    if (storedToken) {
      return {
        ...headers,
        'Authorization': `Bearer ${storedToken}`
      };
    }
    
    return headers;
  }
}