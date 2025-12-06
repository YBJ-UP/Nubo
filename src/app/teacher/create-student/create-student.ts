import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from "@angular/router";
import { LoadingScreenOverlay } from '../../shared/loading-screen-overlay/loading-screen-overlay';
import { NavigationService } from '../../services/navigation/navigation-service';
import { StudentService } from '../../services/estudiantes/student.service';
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-create-student',
  imports: [CommonModule, RouterModule, LoadingScreenOverlay, NgIf],
  templateUrl: './create-student.html',
  styleUrl: './create-student.css'
})
export class CreateStudent implements OnInit {
  data: Student[] = [];
  mostrarVistaHija: boolean = false;
  isLoading: boolean = false

  constructor(private router: Router, private studentService: StudentService, private nav: NavigationService) {
    this.nav.currentView.set("Alumnos")
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
  }

  ngOnInit(): void {
    this.isLoading = true
    this.cargarEstudiantes();
    this.actualizarVistaHija();
  }

  async cargarEstudiantes() {
    const estudiantesGuardados = (await this.studentService.getAllStudents()).body;
    if (estudiantesGuardados){
      this.data = estudiantesGuardados
    }
    this.isLoading = false
  }

  actualizarVistaHija(): void {
    const url = this.router.url;
    this.mostrarVistaHija = url.includes('/students/new') || url.includes('/students/view/');
    console.log('URL actual:', url, 'Mostrar vista hija:', this.mostrarVistaHija);
  }

  crearNuevoAlumno(): void {
    this.router.navigate(['/teacher/students/new']);
  }

  verDetalleAlumno(id: string): void {
    this.router.navigate(['/teacher/students/view', id]);
  }
}