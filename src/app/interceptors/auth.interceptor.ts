import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeacherAuthService } from '../services/authentication/teacher-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: TeacherAuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getAuthToken();
        const authReq = req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
        });
        return next.handle(authReq).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.authService.logout();
                }
                return throwError(() => err);
            })
        );
    }
}
