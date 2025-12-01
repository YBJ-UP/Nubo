import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Student } from '../../interfaces/student';

interface StudentProgress {
  modulo1: number;
  modulo2: number;
  lastUpdated?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly STORAGE_KEY = 'students';
  private readonly PROGRESS_PREFIX = 'progreso_';
  
  
  private saveStudents(students: Student[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
  }

  getProgress(studentId: string | number): StudentProgress {
    const key = `${this.PROGRESS_PREFIX}${String(studentId)}`;
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

  saveProgress(studentId: string | number, progress: StudentProgress): void {
    const key = `${this.PROGRESS_PREFIX}${String(studentId)}`;
    const progressWithDate = {
      ...progress,
      lastUpdated: new Date()
    };
    localStorage.setItem(key, JSON.stringify(progressWithDate));
  }

  

  updateProgress(studentId: string | number, module: 'modulo1' | 'modulo2', value: number): void {
    const current = this.getProgress(studentId);
    current[module] = Math.max(0, Math.min(100, value));
    this.saveProgress(studentId, current);
  }

  private deleteProgress(studentId: string | number): void {
    const key = `${this.PROGRESS_PREFIX}${String(studentId)}`;
    localStorage.removeItem(key);
  }

  generatePassword(firstName: string): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${firstName.toLowerCase()}${randomNum}`;
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