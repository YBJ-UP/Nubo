import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { StudentAuthResponse } from '../../interfaces/students/auth/student-auth-response';
import { StudentLoginRequest } from '../../interfaces/students/auth/student-login-request';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {
  currentStudent: StudentAuthResponse | null = null;

  constructor(private apiConfig: ApiConfigService) {
    this.loadFromStorage();
  }

  async login(credentials: StudentLoginRequest): Promise<{
    success: boolean;
    message: string;
    student?: StudentAuthResponse;
  }> {
    try {
      const response = await fetch(
        this.apiConfig.getFullUrl('/students/login'),
        {
          method: 'POST',
          headers: this.apiConfig.getAuthHeaders(),
          body: JSON.stringify(credentials)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Credenciales inválidas',
        };
      }
      
      const studentJSON = await response.json()
      console.log('DATOS RECIBIDOS DEL LOGIN:', studentJSON);
      const student: StudentAuthResponse = {
        id: studentJSON.id,
        teacherId: studentJSON.teacherId,
        fullName: `${studentJSON.nombre} ${studentJSON.apellidoP} ${studentJSON.apellidoM}`
      }
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