import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Student } from '../../interfaces/student';
import studentData from '../../../../public/placeholderData/studentData.json';

@Component({
  selector: 'app-new-student',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-student.html',
  styleUrl: './new-student.css'
})
export class NewStudent implements OnInit {
  inputTextFields: string[] = ['', '', ''];
  inputText: string = '';
  imagenPreview: string = 'raul.jpg';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.inputTextFields = ['', '', ''];
  }

  addValue(inputValue: string, field: number): void {
    this.inputTextFields[field] = inputValue;
    const nombreCompleto = this.inputTextFields.filter(text => text.trim()).join(' ');
    this.inputText = nombreCompleto || 'Nombre del alumno...';
  }

  submit(form: NgForm): void {
    const { newName, newFirstName, newLastName } = form.value;

    if (!newName?.trim()) {
      alert('Por favor ingresa el nombre del alumno');
      return;
    }

    if (!newFirstName?.trim() || !newLastName?.trim()) {
      alert('Por favor ingresa los apellidos completos del alumno');
      return;
    }

    const nuevoEstudiante: Student = {
      id: Date.now(), 
      teacher_id: 1,
      pfp: this.imagenPreview,
      name: newName.trim(),
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      password: this.generarPassword() 
    };

    this.guardarEstudiante(nuevoEstudiante);

    alert(`Alumno ${nuevoEstudiante.name} creado exitosamente\n\nContraseña generada: ${nuevoEstudiante.password}`);
    
    this.router.navigate(['/teacher/students']);
  }

  guardarEstudiante(estudiante: Student): void {
    try {
      const estudiantesGuardados = localStorage.getItem('students');
      const estudiantes = estudiantesGuardados ? JSON.parse(estudiantesGuardados) : [...studentData];
      
      estudiantes.push(estudiante);
      localStorage.setItem('students', JSON.stringify(estudiantes));
      
      console.log('Estudiante guardado:', estudiante);
    } catch (error) {
      console.error('Error al guardar estudiante:', error);
      alert('Error al guardar el estudiante. Por favor intenta de nuevo.');
    }
  }

  generarPassword(): string {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${this.inputTextFields[0].toLowerCase()}${randomNum}`;
  }

  cancelar(): void {
    if (this.inputTextFields.some(field => field.trim())) {
      if (confirm('¿Estás seguro de que deseas cancelar? Los datos ingresados se perderán.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }

  cambiarImagen(): void {
    console.log('Cambiar imagen del perfil');
  }
}