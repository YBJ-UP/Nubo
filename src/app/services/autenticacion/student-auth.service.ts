import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
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
    private http: HttpClient,
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

      const student = await firstValueFrom(
        this.http.post<StudentAuthResponse>(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/students/login`),
          credentials,
          { headers: this.apiConfig.getCommonHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );

      this.saveToStorage(student);

      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        student
      };
    } catch (error: any) {
      console.error('Error en login de estudiante:', error);
      return {
        success: false,
        message: error.error?.message || 'Error de conexión con el servidor'
      };
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
    }
    
    console.error('HttpClient Error:', errorMessage);
    return throwError(() => error);
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