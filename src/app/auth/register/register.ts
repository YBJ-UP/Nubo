import { Component } from '@angular/core';
import { Cloud } from '../../components/cloud/cloud';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Nube } from '../../components/nube/nube';
import { TeacherAuthService } from '../../services/teacher-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [Cloud, RouterLink, FormsModule, Nube, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  isLoading = false;
  errorMessage = '';
  
  constructor(
    private router: Router,
    private authService: TeacherAuthService
  ) {}

  async submit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    const { name, lastName, email, school, psw, cPsw } = form.value;

    if (!name || !lastName || !email || !psw) {
      this.errorMessage = 'Por favor completa todos los campos obligatorios';
      return;
    }

    if (psw !== cPsw) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (psw.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const result = await this.authService.register({
        nombre: name.trim(),
        apellidos: lastName.trim(),
        email: email.trim().toLowerCase(),
        contraseña: psw,
        escuela: school?.trim() || undefined
      });

      if (result.success && result.teacher) {
        console.log('Registro exitoso:', result.teacher);
        
        alert(`¡Bienvenido ${result.teacher.fullname}!\n\nTu cuenta ha sido creada exitosamente.`);
        
        this.router.navigate(['teacher']);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      console.error('Error en registro:', error);
      this.errorMessage = 'Error inesperado. Por favor intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}