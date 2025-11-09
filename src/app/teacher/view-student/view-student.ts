import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Student } from '../../interfaces/student';
import studentData from '../../../../public/placeholderData/studentData.json';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEstudiante(parseInt(id));
      this.cargarProgreso(parseInt(id));
    }
  }

  cargarEstudiante(id: number): void {
    const estudiantesGuardados = localStorage.getItem('students');
    const estudiantes = estudiantesGuardados 
      ? JSON.parse(estudiantesGuardados) 
      : studentData;

    this.student = estudiantes.find((s: Student) => s.id === id);
    
    if (!this.student) {
      console.error('Estudiante no encontrado');
    }
  }

  cargarProgreso(id: number): void {
    const progresoGuardado = localStorage.getItem(`progreso_${id}`);
    
    if (progresoGuardado) {
      const progreso = JSON.parse(progresoGuardado);
      this.progresoModulo1 = progreso.modulo1 || 0;
      this.progresoModulo2 = progreso.modulo2 || 0;
    } else {
      this.progresoModulo1 = Math.floor(Math.random() * 101);
      this.progresoModulo2 = Math.floor(Math.random() * 101);
      
      this.guardarProgreso(id);
    }
  }

  guardarProgreso(id: number): void {
    const progreso = {
      modulo1: this.progresoModulo1,
      modulo2: this.progresoModulo2
    };
    localStorage.setItem(`progreso_${id}`, JSON.stringify(progreso));
  }

  regresar(): void {
    this.location.back();
  }

  eliminarAlumno(): void {
    if (!this.student) return;

    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar a ${this.student.name}?\n\nEsta acción no se puede deshacer.`
    );

    if (confirmacion) {
      const estudiantesGuardados = localStorage.getItem('students');
      if (estudiantesGuardados) {
        const estudiantes = JSON.parse(estudiantesGuardados);
        const estudiantesFiltrados = estudiantes.filter(
          (s: Student) => s.id !== this.student!.id
        );
        localStorage.setItem('students', JSON.stringify(estudiantesFiltrados));
      }

      localStorage.removeItem(`progreso_${this.student.id}`);

      alert(`${this.student.name} ha sido eliminado exitosamente.`);
      this.router.navigate(['/teacher/students']);
    }
  }

  ingresarComoAlumno(): void {
    if (!this.student) return;

    const confirmacion = confirm(
      `¿Deseas ingresar como ${this.student.name}?`
    );

    if (confirmacion) {
      sessionStorage.setItem('current_student', JSON.stringify(this.student));
      this.router.navigate(['/student']);
    }
  }
}