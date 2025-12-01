import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { StudentService } from '../../services/estudiantes/sstudent.service';
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

  constructor(private router: Router, private studentService: StudentService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.actualizarVistaHija();
        // recargar la lista cuando la ruta cambia (asegura que los nuevos alumnos aparezcan)
        this.cargarEstudiantes();
        // si la URL incluye query param para hacer scroll, desplazar al final
        try {
          const url = this.router.url;
          if (url.includes('scroll=bottom')) {
            setTimeout(() => {
              const grid = document.querySelector('.students-grid') as HTMLElement | null;
              if (grid) {
                grid.scrollTo({ top: grid.scrollHeight, behavior: 'smooth' });
              } else {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }
            }, 120);
          }
        } catch (err) {
          console.warn('Scroll to bottom error', err);
        }
      }
    });

    // Suscribirse a cambios en la lista para actualizar en tiempo real
    this.studentService.onStudentsChanged().subscribe(() => {
      this.cargarEstudiantes();
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