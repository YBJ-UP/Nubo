import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from './teacher-auth.service';

interface StudentAuthResponse {
  id: string;           
  teacherId: string;   
  fullName: string;    
}


interface StudentLoginCredentials {
  nombre: string;
  apellidoP: string;
  apellidoM: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  private currentStudent: StudentAuthResponse | null = null;

  constructor(
    private apiConfig: ApiConfigService,
    private teacherAuth: TeacherAuthService
  ) {
    this.loadFromStorage();
  }

  async login(credentials: StudentLoginCredentials): Promise<{
    success: boolean;
    message: string;
    student?: StudentAuthResponse;
  }> {
    try {
      const teacher = this.teacherAuth.getCurrentTeacher();
      if (!teacher) {
        return {
          success: false,
          message: 'No hay un maestro autenticado'
        };
      }

      const response = await fetch(
        this.apiConfig.getEndpoint(`/teacher/${teacher.id}/students/login`),
        {
          method: 'POST',
          headers: this.apiConfig.getCommonHeaders(),
          body: JSON.stringify(credentials)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Credenciales inválidas'
        };
      }

      const student: StudentAuthResponse = await response.json();
      this.saveToStorage(student);

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        student
      };
    } catch (error) {
      console.error('Error en login de estudiante:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  logout(): void {
    this.currentStudent = null;
    localStorage.removeItem('currentStudent');
    console.log('Sesión de estudiante cerrada');
  }

  getCurrentStudent(): StudentAuthResponse | null {
    return this.currentStudent;
  }

  isAuthenticated(): boolean {
    return this.currentStudent !== null;
  }

  private saveToStorage(student: StudentAuthResponse): void {
    this.currentStudent = student;
    localStorage.setItem('currentStudent', JSON.stringify(student));
    console.log('Estudiante guardado:', student);
  }

  private loadFromStorage(): void {
    try {
      const studentData = localStorage.getItem('currentStudent');

      if (studentData) {
        this.currentStudent = JSON.parse(studentData);
        console.log('Estudiante cargado desde localStorage');
      }
    } catch (error) {
      console.error('Error al cargar estudiante desde localStorage:', error);
      this.logout();
    }
  }

  updateStudent(student: StudentAuthResponse): void {
    this.currentStudent = student;
    localStorage.setItem('currentStudent', JSON.stringify(student));
  }
}