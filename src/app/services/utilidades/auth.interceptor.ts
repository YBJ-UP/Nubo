import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeacherAuthService } from '../autenticacion/teacher-auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: TeacherAuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Verificar si el token ha expirado
    if (this.authService.isTokenExpired()) {
      console.warn('Token expirado. Cerrando sesión...');
      this.authService.logout();
      this.router.navigate(['/login']);
      return throwError(() => new Error('Token expirado'));
    }

    // Agregar el token al header si existe
    const token = this.authService.getAuthToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si recibimos 401 (Unauthorized), probablemente el token expiró en el servidor
        if (error.status === 401) {
          console.warn('Token inválido o expirado según el servidor');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
