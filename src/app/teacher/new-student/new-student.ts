// src/app/teacher/new-student/new-student.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ImageService } from '../../services/image.service';
import { StudentService } from '../../services/sstudent.service';

@Component({
  selector: 'app-new-student',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-student.html',
  styleUrl: './new-student.css'
})
export class NewStudent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  inputTextFields: string[] = ['', '', ''];
  inputText: string = '';
  imagenPreview: string;
  isUploading: boolean = false;

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
        alert(result.message);
      }
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      alert('Error inesperado al cargar la imagen');
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
      alert(validationError);
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

    alert(
      `Alumno ${nuevoEstudiante.name} creado exitosamente\n\n` +
      `Contraseña generada: ${password}\n\n` +
      `Guarda esta contraseña para que el alumno pueda ingresar.`
    );
    
    this.router.navigate(['/teacher/students']);
  }

  cancelar(): void {
    const hasChanges = this.inputTextFields.some(field => field.trim()) ||
                       this.imagenPreview !== this.imageService.getDefaultAvatar();

    if (hasChanges) {
      if (confirm('¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }
}