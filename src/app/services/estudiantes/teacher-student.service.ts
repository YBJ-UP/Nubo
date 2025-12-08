import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../authentication/teacher-auth.service';
import { CreateStudentRequest } from '../../interfaces/teacher/students/create-student-request';
import { StudentResponse } from '../../interfaces/teacher/students/student-response';

@Injectable({
  providedIn: 'root'
})
export class TeacherStudentService {
  constructor(
    private apiConfig: ApiConfigService,
    private authService: TeacherAuthService
  ) {}

  async createStudent(studentData: CreateStudentRequest): Promise<{ success: boolean; message: string; student?: StudentResponse }> {
    const teacher = this.authService.currentTeacher;
    
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

      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/students`),
        {
          method: 'POST',
          headers: this.apiConfig.getAuthHeaders(),
          body: JSON.stringify(requestData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: `Error al crear el estudiante:\n${error.message}`
        };
      }

      const student: StudentResponse = await response.json();
      
      return {
        success: true,
        message: 'Estudiante creado exitosamente',
        student
      };
    } catch (error) {
      console.error('Error al crear estudiante:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
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
      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/students`),
        {
          method: 'GET',
          headers: this.apiConfig.getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Error al obtener estudiantes',
          students: []
        };
      }

      const students: StudentResponse[] = await response.json();
      
      return {
        success: true,
        message: 'Estudiantes obtenidos exitosamente',
        students
      };
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
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
      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/students/${studentId}`),
        {
          method: 'DELETE',
          headers: this.apiConfig.getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.message || 'Error al eliminar estudiante'
        };
      }

      return {
        success: true,
        message: 'Estudiante eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
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