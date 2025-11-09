import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { Student } from '../../interfaces/student';
import studentData from '../../../../public/placeholderData/studentData.json';
import { filter } from 'rxjs/operators';

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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.actualizarVistaHija();
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
    this.mostrarVistaHija = url.includes('/new') || url.includes('/view/');
  }

  crearNuevoAlumno(): void {
    this.router.navigate(['/teacher/students/new']);
  }

  verDetalleAlumno(id: number): void {
    this.router.navigate(['/teacher/students/view', id]);
  }
}