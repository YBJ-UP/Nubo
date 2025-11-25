// src/app/teacher/new-student/new-student.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from '../../services/image.service';
import { StudentService } from '../../services/sstudent.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-new-student',
  imports: [CommonModule, FormsModule, RouterModule, FloatingMessage],
  templateUrl: './new-student.html',
  styleUrls: ['./new-student.css']
})
export class NewStudent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
      teacher_id: 1,
      pfp: this.imagenPreview,
      name: newName.trim(),
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      password
    });

    this.showFloating(
      'Alumno creado',
      `Alumno ${nuevoEstudiante.name} creado exitosamente\n\nContraseña generada: ${password}\n\nGuarda esta contraseña para que el alumno pueda ingresar.`,
      'success',
    );
    // set primary callback to navigate back after user accepts
    this.fmPrimaryCb = () => this.router.navigate(['/teacher/students']);
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
    // close without action
    this.fmVisible = false;
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
}