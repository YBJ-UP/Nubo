import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { HttpClient } from '@angular/common/http';
import { TeacherAuthResponse } from '../../interfaces/teacher/auth/teacher-auth-response';
import { ApiAuthResponse } from '../../interfaces/teacher/auth/api-auth-response';
import { TeacherLoginRequest } from '../../interfaces/teacher/auth/teacher-login-request';
import { TeacherSignupRequest } from '../../interfaces/teacher/auth/teacher-signup-request';

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthService {
  currentTeacher: TeacherAuthResponse | null = null;
  private authToken: string | null = null;

  private readonly TEACHER_KEY = 'currentTeacher';
  private readonly TOKEN_KEY = 'teacher_token';

  constructor(private apiConfig: ApiConfigService, private http: HttpClient) {
    this.loadFromStorage();
  }

  async register(data: TeacherSignupRequest): Promise<{
    success: boolean;
    message: string;
    teacher?: TeacherAuthResponse;
    token?: string;
  }> {
    try {
      const result = await this.http.post<ApiAuthResponse>(
        this.apiConfig.getFullUrl('/teacher/register'),
        data,
        { headers: this.apiConfig.getHttpHeaders() }
      ).toPromise();

      if (!result) {
        return { success: false, message: 'Respuesta vacía del servidor' };
      }
      this.saveToStorage(result.teacher, result.token);
      return {
        success: true,
        message: 'Maestro registrado exitosamente',
        teacher: result.teacher,
        token: result.token
      };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor. Verifique que la API esté ejecutándose.'
      };
    }
  }

  async login(credentials: TeacherLoginRequest): Promise<{
    success: boolean;
    message: string;
    teacher?: TeacherAuthResponse;
    token?: string;
  }> {
    try {
      const result = await this.http.post<ApiAuthResponse>(
        this.apiConfig.getFullUrl('/teacher/login'),
        credentials,
        { headers: this.apiConfig.getHttpHeaders() }
      ).toPromise();

      if (!result) {
        return { success: false, message: 'Respuesta vacía del servidor' };
      }
      this.saveToStorage(result.teacher, result.token);
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        teacher: result.teacher,
        token: result.token
      };

    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor. Verifique que la API esté ejecutándose.'
      };
    }
  }

  logout(): void {
    this.currentTeacher = null;
    this.authToken = null;
    localStorage.removeItem(this.TEACHER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem("currentTeacher")
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

    console.log('Maestro guardado:', teacher);
  }

  private loadFromStorage(): void {
    try {
      const teacherData = localStorage.getItem(this.TEACHER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);

      if (teacherData && token) {
        this.currentTeacher = JSON.parse(teacherData);
        this.authToken = token;
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