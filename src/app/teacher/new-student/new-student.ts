// src/app/teacher/new-student/new-student.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from '../../services/utilidades/image.service';
import { StudentService } from '../../services/estudiantes/student.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-new-student',
  imports: [CommonModule, FormsModule, RouterModule, FloatingMessage],
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
    private studentService: StudentService
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

  submit(form: NgForm): void {
    const { newName, newFirstName, newLastName } = form.value;

    const validationError = this.studentService.validateStudentData(
      newName,
      newFirstName,
      newLastName
    );

    if (validationError) {
      this.showFloating('Error', validationError, 'error');
      return;
    }

    const password = this.studentService.generatePassword(newName.trim());

    const nuevoEstudiante = this.studentService.createStudent({
      teacherId: "",
      name: newName.trim(),
      apellidoP: newFirstName.trim(),
      apellidoM: newLastName.trim(),
      password: password
    });

    const message = `Alumno ${nuevoEstudiante.name} creado exitosamente\n\nContraseña generada: ${password}\n\nGuarda esta contraseña para que el alumno pueda ingresar.`;

    this.showFloating(
      'Alumno creado',
      message,
      'success',
      'Ir a la lista',
      'Copiar contraseña',
      () => this.router.navigate(['/teacher/students'], { queryParams: { scroll: 'bottom' } }),
      () => this.copyPasswordAndGo(password),
      false
    );
  }

  private fallbackCopy(text: string): void {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      // Instead of navigating immediately, show the floating message and let user choose
      this.showFloating(
        'Copiado',
        'Contraseña copiada al portapapeles',
        'success',
        'Volver a la lista',
        undefined,
        () => this.goToList(),
        undefined,
        false
      );
    } catch (err) {
      console.error('Copy failed', err);
      this.showFloating('Error', 'No se pudo copiar la contraseña automáticamente. Selecciona y copia manualmente.', 'error');
    }
  }

  private copyPasswordAndGo(text: string): void {
    if (navigator && (navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      (navigator as any).clipboard.writeText(text).then(() => {
        // Show dialog offering to go back to list (less abrupt)
        this.showFloating(
          'Copiado',
          'Contraseña copiada al portapapeles',
          'success',
          'Volver a la lista',
          undefined,
          () => this.goToList(),
          undefined,
          false
        );
      }).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      this.fallbackCopy(text);
    }
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
        // Only scroll minimally if the element is not fully visible
        if (rect.bottom > vwHeight || rect.top < 0) {
          // Use 'nearest' so the element is brought into view without centering
          if (typeof el.scrollIntoView === 'function') {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            window.scrollBy({ top: rect.bottom - vwHeight + 16, behavior: 'smooth' });
          }
        }
      } else {
        // fallback: do nothing to avoid forcing center
      }
    } catch (err) {
      // ignore
    }
  }
}