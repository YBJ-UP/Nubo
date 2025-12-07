
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';
import { ImageService } from '../../services/utilidades/image.service';
import { StudentService } from '../../services/estudiantes/student.service';
import { TeacherStudentService } from '../../services/estudiantes/teacher-student.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { LoadingScreenOverlay } from '../../shared/loading-screen-overlay/loading-screen-overlay';

@Component({
  selector: 'app-new-student',
  imports: [CommonModule, FormsModule, RouterModule, FloatingMessage, LoadingScreenOverlay],
  templateUrl: './new-student.html',
  styleUrls: ['./new-student.css']
})
export class NewStudent implements OnInit, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('buttonContainer') buttonContainer!: ElementRef<HTMLElement>;

  inputTextFields: string[] = ['', '', ''];
  inputText: string = '';
  imagenPreview: string = '';
  isUploading: boolean = false;

  // FloatingMessage state
  fmVisible = false;
  fmTitle = '';
  fmMessage = '';
  fmType: 'success' | 'error' | 'info' = 'info';
  fmPrimaryLabel = 'Aceptar';
  fmSecondaryLabel?: string | undefined;
  fmStackButtons = false;
  private fmPrimaryCb?: () => void;
  private fmSecondaryCb?: () => void;

  constructor(
    private router: Router,
    private location: Location,
    private imageService: ImageService,
    private studentService: StudentService,
    private teacherStudentService: TeacherStudentService,
    private teacher: TeacherAuthService
  ) {
    this.imagenPreview = this.imageService.getDefaultAvatar();
  }

  ngOnInit(): void {
    this.inputTextFields = ['', '', ''];
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToButtons(), 120);
    window.addEventListener('resize', this._resizeScroll);
  }

  private _resizeScroll = () => {
    setTimeout(() => this.scrollToButtons(), 60);
  }

  addValue(inputValue: string, field: number): void {
    this.inputTextFields[field] = inputValue;
    const nombreCompleto = this.inputTextFields.filter(text => text.trim()).join(' ');
    this.inputText = nombreCompleto || 'Nombre del alumno...';
  }

  cambiarImagen(): void {
    this.fileInput?.nativeElement.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;

    if (!input.files || !input.files[0]) {
      return;
    }

    this.isUploading = true;
    const file = input.files[0];

    try {
      const result = await this.imageService.processImage(file);

      if (result.valid && result.imageUrl) {
        this.imagenPreview = result.imageUrl;
      } else {
        this.showFloating('Error', result.message || 'Error al procesar la imagen', 'error');
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      this.showFloating('Error', 'Error inesperado al cargar la imagen', 'error');
    } finally {
      this.isUploading = false;
      input.value = '';
      setTimeout(() => this.scrollToButtons(), 120);
    }
  }

  async submit(form: NgForm) {
    const { newName, newFirstName, newLastName } = form.value;
    this.isUploading = true

    const validationError = this.studentService.validateStudentData(
      newName,
      newFirstName,
      newLastName
    );

    if (validationError) {
      this.showFloating('Error', validationError, 'error');
      this.isUploading = false;
      return;
    }

    let nuevoEstudiante
    if (this.teacher.currentTeacher?.id) {
      nuevoEstudiante = await this.teacherStudentService.createStudent({
        teacherId: this.teacher.currentTeacher.id,
        nombre: newName.trim(),
        apellidoP: newFirstName.trim(),
        apellidoM: newLastName.trim()
      });
    }

    const message = `Alumno ${nuevoEstudiante} creado exitosamente.`;
    console.log(message)
    console.log(nuevoEstudiante?.success)

    if (nuevoEstudiante?.success){
      this.showFloating(
        'Alumno creado',
        nuevoEstudiante.message,
        'success',
        'Ir a la lista',
        undefined,
        () => this.router.navigate(['/teacher/students'], { queryParams: { scroll: 'bottom' } }),
        undefined,
        false
      );
    }else if (nuevoEstudiante?.success == false){
      this.showFloating(
        'Error',
        nuevoEstudiante.message,
        'error',
        'Ir a la lista',
        undefined,
        () => this.router.navigate(['/teacher/students'], { queryParams: { scroll: 'bottom' } }),
        undefined,
        false
      );
    }
    this.isUploading = false
  }

  goToList(): void {
    this.router.navigate(['/teacher/students'], { queryParams: { scroll: 'bottom' } });
  }

  cancelar(): void {
    const hasChanges = this.inputTextFields.some(field => field.trim()) ||
      this.imagenPreview !== this.imageService.getDefaultAvatar();

    if (hasChanges) {
      this.showFloating(
        'Confirmar',
        '¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.',
        'info',
        'Sí',
        'No',
        () => this.location.back(),
        undefined
      );
    } else {
      this.location.back();
    }
  }
  



  showFloating(
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'info',
    primaryLabel = 'Aceptar',
    secondaryLabel?: string,
    primaryCb?: () => void,
    secondaryCb?: () => void
    , stackButtons = false
  ): void {
    this.fmTitle = title;
    this.fmMessage = message;
    this.fmType = type;
    this.fmPrimaryLabel = primaryLabel;
    this.fmSecondaryLabel = secondaryLabel;
    this.fmPrimaryCb = primaryCb;
    this.fmSecondaryCb = secondaryCb;
    this.fmStackButtons = !!stackButtons;
    this.fmVisible = true;
  }

  onFloatingPrimary(): void {
    if (this.fmPrimaryCb) this.fmPrimaryCb();
    this.fmVisible = false;
    this.fmStackButtons = false;
  }

  onFloatingSecondary(): void {
    if (this.fmSecondaryCb) this.fmSecondaryCb();
    this.fmVisible = false;
    this.fmStackButtons = false;
  }

  onFloatingClosed(): void {
    this.fmVisible = false;
    this.fmStackButtons = false;
  }

  private scrollToButtons(): void {
    try {
      const el = this.buttonContainer?.nativeElement;
      if (el && typeof el.getBoundingClientRect === 'function') {
        const rect = el.getBoundingClientRect();
        const vwHeight = window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom > vwHeight || rect.top < 0) {
          if (typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            window.scrollBy({ top: rect.bottom - vwHeight + 16, behavior: 'smooth' });
          }
        }
      } else {
       
      }
    } catch (err) {
      // ignore
    }
  }
}