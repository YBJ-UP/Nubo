import { Injectable } from '@angular/core';
import { Student } from '../../interfaces/student';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../authentication/teacher-auth.service';

interface StudentProgress {
  modulo1: number;
  modulo2: number;
  lastUpdated?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  
  constructor(private teacher: TeacherAuthService, private api: ApiConfigService){}

  private readonly STORAGE_KEY = 'students';
  private readonly PROGRESS_PREFIX = 'progreso_';
  nonAsyncStudentList: Student[] = []

  async getAllStudents(): Promise<{success: boolean, message: string, body?: Student[]}> {

    if (!this.teacher){
      return {
        success: false,
        message: "No se encontró el profesor."
      }
    }

    try {

      const response = await fetch(this.api.getEndpoint(`/teacher/${this.teacher.currentTeacher?.id}/students`));

        if (!response.ok){
          return {
            success: false,
            message: "Error al conseguir los datos."
          }
        }

        const studentList: Student[] = await response.json()
        this.nonAsyncStudentList = studentList

        return {
          success: true,
          message: "Se han traído los datos con éxito",
          body: studentList
        }
    } catch (e) {
      console.error(e)
      return {
        success: false,
        message: "Ha ocurrido un error al hacer la petición"
      }
    }
  }

  async getStudentById(id: string) {
    console.log(id)
    const students = await this.nonAsyncStudentList;
    if (students){
      return students.find(s => s.id === id);
    }
    else {
      return undefined
    }
  }


  /*async deleteStudent(id: string) {
    const students = this.getAllStudents();
    const filtered = students.filter(s => s.id !== id);
    
    if (filtered.length === students.length) return false;
    
    this.saveStudents(filtered);
    this.deleteProgress(id);
    this.studentsChanged.next();
    
    return true;
  }*/

  getProgress(studentId: string): StudentProgress {
    const key = `${this.PROGRESS_PREFIX}${studentId}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultProgress: StudentProgress = {
      modulo1: Math.floor(Math.random() * 101),
      modulo2: Math.floor(Math.random() * 101),
      lastUpdated: new Date()
    };
    
    this.saveProgress(studentId, defaultProgress);
    return defaultProgress;
  }

  saveProgress(studentId: string, progress: StudentProgress): void {
    const key = `${this.PROGRESS_PREFIX}${studentId}`;
    const progressWithDate = {
      ...progress,
      lastUpdated: new Date()
    };
    localStorage.setItem(key, JSON.stringify(progressWithDate));
  }

  updateProgress(studentId: string, module: 'modulo1' | 'modulo2', value: number): void {
    const current = this.getProgress(studentId);
    current[module] = Math.max(0, Math.min(100, value));
    this.saveProgress(studentId, current);
  }

  validateStudentData(name: string, firstName: string, lastName: string): string | null {
    if (!name?.trim()) {
      return 'Por favor ingresa el nombre del alumno';
    }

    if (!firstName?.trim()) {
      return 'Por favor ingresa el apellido paterno';
    }

    if (!lastName?.trim()) {
      return 'Por favor ingresa el apellido materno';
    }

    return null;
  }
}