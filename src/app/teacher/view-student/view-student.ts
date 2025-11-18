import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Student } from '../../interfaces/student';
import { StudentService } from '../../services/sstudent.service';

@Component({
  selector: 'app-view-student',
  imports: [CommonModule],
  templateUrl: './view-student.html',
  styleUrl: './view-student.css'
})
export class ViewStudent implements OnInit {
  student: Student | undefined;
  progresoModulo1: number = 0;
  progresoModulo2: number = 0;
  
  private readonly TOTAL_ACTIVIDADES = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEstudiante(parseInt(id));
    }
  }

  cargarEstudiante(id: number): void {
    this.student = this.studentService.getStudentById(id);
    
    if (!this.student) {
      console.error('Estudiante no encontrado');
      return;
    }

    const progreso = this.studentService.getProgress(id);
    this.progresoModulo1 = progreso.modulo1;
    this.progresoModulo2 = progreso.modulo2;
  }

  calcularActividadesCompletadas(progreso: number): number {
    return Math.floor((progreso / 100) * this.TOTAL_ACTIVIDADES);
  }

  calcularActividadesFaltantes(progreso: number): number {
    return this.TOTAL_ACTIVIDADES - this.calcularActividadesCompletadas(progreso);
  }

  regresar(): void {
    this.location.back();
  }

  eliminarAlumno(): void {
    if (!this.student) return;

    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar a ${this.student.name}?\n\n` +
      `Esta acción eliminará:\n` +
      `• El perfil del estudiante\n` +
      `• Todo su progreso\n` +
      `• Sus datos de acceso\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (confirmacion) {
      const eliminado = this.studentService.deleteStudent(this.student.id);
      
      if (eliminado) {
        alert(`${this.student.name} ha sido eliminado exitosamente.`);
        this.router.navigate(['/teacher/students']);
      } else {
        alert('Error al eliminar el estudiante. Intenta de nuevo.');
      }
    }
  }

  ingresarComoAlumno(): void {
    if (!this.student) return;

    const confirmacion = confirm(
      `¿Deseas ingresar como ${this.student.name}?\n\n` +
      `Esto te permitirá ver la plataforma desde su perspectiva.`
    );

    if (confirmacion) {
      sessionStorage.setItem('current_student', JSON.stringify(this.student));
      this.router.navigate(['/student']);
    }
  }
}