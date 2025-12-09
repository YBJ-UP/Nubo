import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingScreenOverlay } from '../../shared/loading-screen-overlay/loading-screen-overlay';
import { Student } from '../../interfaces/student';
import { StudentService } from '../../services/estudiantes/student.service';
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';
import { StudentAuthService } from '../../services/authentication/student-auth.service';
import { StudentLoginRequest } from '../../interfaces/students/auth/student-login-request';

@Component({
  selector: 'app-view-student',
  imports: [CommonModule, FloatingMessage, LoadingScreenOverlay],
  templateUrl: './view-student.html',
  styleUrl: './view-student.css',
})
export class ViewStudent implements OnInit {
  student: Student | undefined;
  progresoModulo1: number = 0;
  progresoModulo2: number = 0;

  private readonly TOTAL_ACTIVIDADES = 10;
  isLoading: boolean = false

  // FloatingMessage state
  fmVisible = false;
  fmTitle = '';
  fmMessage = '';
  fmType: 'success' | 'error' | 'info' = 'info';
  fmPrimaryLabel = 'Aceptar';
  fmSecondaryLabel?: string | undefined;
  private fmPrimaryCb?: () => void;
  private fmSecondaryCb?: () => void;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private studentService: StudentService,
    private teacher: TeacherAuthService,
    private studentAuth: StudentAuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarEstudiante(id);
    }
  }

  async cargarEstudiante(id: string) {
    this.student = await this.studentService.getStudentById(id);

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

  //evento
  eliminarAlumno(): void {
    if (!this.student) return;

    const title = `Eliminar alumno`;
    const message = `¿Estás seguro de que deseas eliminar a ${this.student.nombre}?\n\nEsta acción eliminará:\n• El perfil del estudiante\n• Todo su progreso\n• Sus datos de acceso\n\nEsta acción no se puede deshacer.`;
    this.showFloating(
      title,
      message,
      'info',
      'Eliminar',
      'Cancelar',
      async () => { 
        if (!this.student) return;
        this.isLoading = true;
        const resultado = await this.studentService.deleteStudent(this.student.id);
        this.isLoading = false; 

        if (resultado.success) {
          this.showFloating(
            'Eliminado',
            `${this.student!.nombre} ha sido eliminado exitosamente.`,
            'success',
            'Aceptar',
            undefined,
            () => {
              this.router.navigate(['/teacher/students']); 
            }
          );
        } else {
          this.showFloating('Error', resultado.message, 'error');
        }
      }
    );
  }

  async ingresarComoAlumno() {
    if (!this.student) return;

    const title = `Ingresar como alumno`;
    const message = `¿Deseas ingresar como ${this.student.nombre}?\n\nEsto te permitirá ver la plataforma desde su perspectiva.`;

    this.showFloating(
      title,
      message,
      'info',
      'Ingresar',
      'Cancelar',
      async () => {
        if (this.student) {
          const loginRequest: StudentLoginRequest = {
            nombre: this.student.nombre,
            apellidoP: this.student.apellidoP,
            apellidoM: this.student.apellidoM
          }
          this.isLoading = true
          this.teacher.logout();
          const login = await this.studentAuth.login(loginRequest)
          this.router.navigate(['/student']);
        }
      },
      () => {
        /* cancel */
      }
    );
  }

  showFloating(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    primaryLabel = 'Aceptar',
    secondaryLabel?: string,
    primaryCb?: () => void,
    secondaryCb?: () => void
  ): void {
    this.fmTitle = title;
    this.fmMessage = message;
    this.fmType = type;
    this.fmPrimaryLabel = primaryLabel;
    this.fmSecondaryLabel = secondaryLabel;
    this.fmPrimaryCb = primaryCb;
    this.fmSecondaryCb = secondaryCb;
    this.fmVisible = true;
  }

  onFloatingPrimary(): void {
    if (this.fmPrimaryCb) this.fmPrimaryCb();
    this.fmVisible = false;
  }

  onFloatingSecondary(): void {
    if (this.fmSecondaryCb) this.fmSecondaryCb();
    this.fmVisible = false;
  }

  onFloatingClosed(): void {
    this.fmVisible = false;
  }
}
