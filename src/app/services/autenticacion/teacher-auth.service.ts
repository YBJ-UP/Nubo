import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { Subject } from 'rxjs';
import { ApiConfigService } from '../utilidades/api-config.service';
import { Teacher } from '../../interfaces/teacher';

interface TeacherAuthResponse {
  id: string;
  fullname: string;
  email: string;
  escuela?: string;
}

interface AuthApiResponse {
  token: string;
  teacher: TeacherAuthResponse;
}

interface LoginCredentials {
  email: string;
  contraseña: string;
}

interface RegisterData {
  nombre: string;
  apellidos: string;
  email: string;
  contraseña: string;
  escuela: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthService {
  private currentTeacher: TeacherAuthResponse | null = null;
  private authToken: string | null = null;

  private readonly TEACHER_KEY = 'currentTeacher';
  private readonly TOKEN_KEY = 'teacher_token';
  private teacherChanged = new Subject<TeacherAuthResponse | null>();
  public teacherChanged$ = this.teacherChanged.asObservable();

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService
  ) {
    this.loadFromStorage();
  }

  async register(data: RegisterData): Promise<{ 
    success: boolean; 
    message: string; 
    teacher?: TeacherAuthResponse;
    token?: string;
  }> {
    try {
      const result = await firstValueFrom(
        this.http.post<any>(
          this.apiConfig.getEndpoint('/teacher/register'),
          data,
          { headers: this.apiConfig.getCommonHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );

      // tolerant response parsing: token may be token|accessToken|authToken
      const token = result?.token || result?.accessToken || result?.authToken || null;
      const teacherObj = result?.teacher || result?.user || result?.maestro || result?.teacherData || null;

      if (token && teacherObj) {
        this.saveToStorage(teacherObj, token);
      }

      return {
        success: true,
        message: 'Maestro registrado exitosamente',
        teacher: teacherObj ?? undefined,
        token: token ?? undefined
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: error.error?.error || 'Error de conexión con el servidor. Verifica que la API esté ejecutándose.'
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ 
    success: boolean; 
    message: string; 
    teacher?: TeacherAuthResponse;
    token?: string;
  }> {
    try {
      const result = await firstValueFrom(
        this.http.post<any>(
          this.apiConfig.getEndpoint('/teacher/login'),
          credentials,
          { headers: this.apiConfig.getCommonHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );

      const token = result?.token || result?.accessToken || result?.authToken || null;
      const teacherObj = result?.teacher || result?.user || result?.maestro || null;

      if (token && teacherObj) {
        this.saveToStorage(teacherObj, token);
      }

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        teacher: teacherObj ?? undefined,
        token: token ?? undefined
      };
    } catch (error: any) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.error?.error || 'Error de conexión con el servidor. Verifica que la API esté ejecutándose.'
      };
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
    }
    
    console.error('HttpClient Error:', errorMessage);
    return throwError(() => error);
  }

  logout(): void {
    this.currentTeacher = null;
    this.authToken = null;
    localStorage.removeItem(this.TEACHER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('Sesión cerrada');
  }

  getCurrentTeacher(): TeacherAuthResponse | null {
    return this.currentTeacher;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return this.currentTeacher !== null && this.authToken !== null;
  }

  private saveToStorage(teacher: TeacherAuthResponse, token: string): void {
    this.currentTeacher = teacher;
    this.authToken = token;
    
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.TEACHER_KEY, JSON.stringify(teacher));
    try { this.teacherChanged.next(teacher); } catch (err) {}
    console.log('Maestro guardado:', teacher);
  }

  private loadFromStorage(): void {
    try {
      const teacherData = localStorage.getItem(this.TEACHER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      
      if (teacherData && token) {
        this.currentTeacher = JSON.parse(teacherData);
        this.authToken = token;
        try { this.teacherChanged.next(this.currentTeacher); } catch (err) {}
        console.log('Maestro cargado desde localStorage');
      }
    } catch (error) {
      console.error('Error al cargar maestro desde localStorage:', error);
      this.logout();
    }
  }

  updateTeacher(teacher: TeacherAuthResponse): void {
    this.currentTeacher = teacher;
    localStorage.setItem(this.TEACHER_KEY, JSON.stringify(teacher));
    try { this.teacherChanged.next(teacher); } catch (err) {}
  }

  isTokenExpired(): boolean {
    if (!this.authToken) return true;
    
    try {
      const payload = JSON.parse(atob(this.authToken.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch (error) {
      console.error('Error al verificar expiración del token:', error);
      return true;
    }
  }
}