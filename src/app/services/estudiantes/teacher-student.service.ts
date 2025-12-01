import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../autenticacion/teacher-auth.service';

interface StudentResponse {
  studentId: string;
  teacherId: string;
  fullName: string;
}

interface CreateStudentRequest {
  teacherId: string;
  nombre: string;
  apellidoP: string;
  apellidoM: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeacherStudentService {
  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private authService: TeacherAuthService
  ) {}

  async createStudent(studentData: {
    nombre: string;
    apellidoP: string;
    apellidoM: string;
  }): Promise<{ success: boolean; message: string; student?: StudentResponse }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado'
      };
    }

    try {
      const requestData: CreateStudentRequest = {
        teacherId: teacher.id,
        nombre: studentData.nombre,
        apellidoP: studentData.apellidoP,
        apellidoM: studentData.apellidoM
      };

      const student = await firstValueFrom(
        this.http.post<StudentResponse>(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/students`),
          requestData,
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );
      
      return {
        success: true,
        message: 'Estudiante creado exitosamente',
        student
      };
    } catch (error: any) {
      console.error('Error al crear estudiante:', error);
      return {
        success: false,
        message: error.error?.message || 'Error de conexión con el servidor'
      };
    }
  }

  async getMyStudents(): Promise<{ success: boolean; message: string; students?: StudentResponse[] }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado',
        students: []
      };
    }

    try {
      const students = await firstValueFrom(
        this.http.get<StudentResponse[]>(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/students`),
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );
      
      return {
        success: true,
        message: 'Estudiantes obtenidos exitosamente',
        students
      };
    } catch (error: any) {
      console.error('Error al obtener estudiantes:', error);
      return {
        success: false,
        message: error.error?.message || 'Error de conexión con el servidor',
        students: []
      };
    }
  }

  async deleteStudent(studentId: string): Promise<{ success: boolean; message: string }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado'
      };
    }

    try {
      await firstValueFrom(
        this.http.delete(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/students/${studentId}`),
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );

      return {
        success: true,
        message: 'Estudiante eliminado exitosamente'
      };
    } catch (error: any) {
      console.error('Error al eliminar estudiante:', error);
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

  convertToLocalFormat(student: StudentResponse): any {
    const nameParts = student.fullName.split(' ');
    
    return {
      id: student.studentId,
      teacherId: student.teacherId,
      name: nameParts[0] || '',
      firstName: nameParts[1] || '',
      lastName: nameParts[2] || '',
      pfp: 'perfil.jpg' 
    };
  }

  convertArrayToLocalFormat(students: StudentResponse[]): any[] {
    return students.map(student => this.convertToLocalFormat(student));
  }
}