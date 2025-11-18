import { Injectable } from '@angular/core';
import { Student } from '../interfaces/student';
import studentData from '../../../public/placeholderData/studentData.json';

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

  getAllStudents(): Student[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...studentData];
  }

  getStudentById(id: number): Student | undefined {
    const students = this.getAllStudents();
    return students.find(s => s.id === id);
  }

  createStudent(studentData: Omit<Student, 'id'>): Student {
    const students = this.getAllStudents();
    
    const newStudent: Student = {
      ...studentData,
      id: Date.now()
    };

    students.push(newStudent);
    this.saveStudents(students);
    
    return newStudent;
  }

  updateStudent(id: number, updates: Partial<Student>): boolean {
    const students = this.getAllStudents();
    const index = students.findIndex(s => s.id === id);
    
    if (index === -1) return false;
    
    students[index] = { ...students[index], ...updates };
    this.saveStudents(students);
    
    return true;
  }

  deleteStudent(id: number): boolean {
    const students = this.getAllStudents();
    const filtered = students.filter(s => s.id !== id);
    
    if (filtered.length === students.length) return false;
    
    this.saveStudents(filtered);
    this.deleteProgress(id);
    
    return true;
  }

  private saveStudents(students: Student[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(students));
  }

  getProgress(studentId: number): StudentProgress {
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

  saveProgress(studentId: number, progress: StudentProgress): void {
    const key = `${this.PROGRESS_PREFIX}${studentId}`;
    const progressWithDate = {
      ...progress,
      lastUpdated: new Date()
    };
    localStorage.setItem(key, JSON.stringify(progressWithDate));
  }

  updateProgress(studentId: number, module: 'modulo1' | 'modulo2', value: number): void {
    const current = this.getProgress(studentId);
    current[module] = Math.max(0, Math.min(100, value));
    this.saveProgress(studentId, current);
  }

  private deleteProgress(studentId: number): void {
    const key = `${this.PROGRESS_PREFIX}${studentId}`;
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