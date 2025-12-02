import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TeacherAuthService } from '../services/authentication/teacher-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: TeacherAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuthenticated = this.authService.isAuthenticated();

    if (!isAuthenticated) {
      console.warn('Usuario no autenticado. Redirigiendo a login...');
      
      localStorage.setItem('redirectUrl', state.url);
      
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}