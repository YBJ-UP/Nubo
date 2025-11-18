import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { Student } from '../../interfaces/student';
import studentData from '../../../../public/placeholderData/studentData.json';

@Component({
  selector: 'app-create-student',
  imports: [CommonModule, RouterModule],
  templateUrl: './create-student.html',
  styleUrl: './create-student.css'
})
export class CreateStudent implements OnInit {
  data: Student[] = [];
  mostrarVistaHija: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.actualizarVistaHija();
      }
    });
  }

  ngOnInit(): void {
    this.cargarEstudiantes();
    this.actualizarVistaHija();
  }

  cargarEstudiantes(): void {
    const estudiantesGuardados = localStorage.getItem('students');
    if (estudiantesGuardados) {
      this.data = JSON.parse(estudiantesGuardados);
    } else {
      this.data = [...studentData];
      localStorage.setItem('students', JSON.stringify(this.data));
    }
  }

  actualizarVistaHija(): void {
    const url = this.router.url;
    this.mostrarVistaHija = url.includes('/students/new') || url.includes('/students/view/');
    console.log('URL actual:', url, 'Mostrar vista hija:', this.mostrarVistaHija);
  }

  crearNuevoAlumno(): void {
    this.router.navigate(['/teacher/students/new']);
  }

  verDetalleAlumno(id: number): void {
    this.router.navigate(['/teacher/students/view', id]);
  }
}