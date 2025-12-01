import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { Teacher } from '../../interfaces/teacher';

interface TeacherAuthResponse {
  id: string;
  fullname: string;
  email: string;
  escuela?: string;
  token?: string; 
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
  escuela?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherAuthService {
  private currentTeacher: TeacherAuthResponse | null = null;
  private authToken: string | null = null;

  constructor(private apiConfig: ApiConfigService) {
    this.loadFromStorage();
  }

  async register(data: RegisterData): Promise<{ success: boolean; message: string; teacher?: TeacherAuthResponse }> {
    try {
      const response = await fetch(this.apiConfig.getEndpoint('/teacher/register'), {
        method: 'POST',
        headers: this.apiConfig.getCommonHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Error al registrar maestro'
        };
      }

      const teacher: TeacherAuthResponse = await response.json();

      this.saveToStorage(teacher, teacher.token);
      
      return {
        success: true,
        message: 'Maestro registrado exitosamente',
        teacher
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor. Verifica que la API esté ejecutándose.'
      };
    }
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; teacher?: TeacherAuthResponse }> {
    try {
      const response = await fetch(this.apiConfig.getEndpoint('/teacher/login'), {
        method: 'POST',
        headers: this.apiConfig.getCommonHeaders(),
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Credenciales inválidas'
        };
      }

      const teacher: TeacherAuthResponse = await response.json();
     
      this.saveToStorage(teacher, teacher.token);
      
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        teacher
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor. Verifica que la API esté ejecutándose.'
      };
    }
  }

  logout(): void {
    this.currentTeacher = null;
    this.authToken = null;
    localStorage.removeItem('currentTeacher');
    localStorage.removeItem('teacher_token');
    console.log('Sesión cerrada');
  }

  getCurrentTeacher(): TeacherAuthResponse | null {
    return this.currentTeacher;
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  isAuthenticated(): boolean {
    return this.currentTeacher !== null;
  }

  private saveToStorage(teacher: TeacherAuthResponse, token?: string): void {
    this.currentTeacher = teacher;
    
    if (token) {
      this.authToken = token;
      localStorage.setItem('teacher_token', token);
    }
    
    localStorage.setItem('currentTeacher', JSON.stringify(teacher));
    console.log('Maestro guardado:', teacher);
  }

  private loadFromStorage(): void {
    try {
      const teacherData = localStorage.getItem('currentTeacher');
      const token = localStorage.getItem('teacher_token');
      
      if (teacherData) {
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
    localStorage.setItem('currentTeacher', JSON.stringify(teacher));
  }
}