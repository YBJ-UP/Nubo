import { Component, signal } from '@angular/core';
import { Cloud } from "../../components/cloud/cloud";
import { RouterLink, Router } from "@angular/router";
import { FormsModule, NgForm } from '@angular/forms';
import { Nube } from "../../components/nube/nube";
import { TeacherAuthService } from '../../services/teacher-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [Cloud, RouterLink, FormsModule, Nube, CommonModule],
  templateUrl: './login.html',
  styleUrl: '../register/register.css'
})
export class Login {
  role = "Maestro";
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: TeacherAuthService
  ) {}

  swicthRole(): void {
    if (this.role == "Maestro") {
      this.role = "Estudiante";
    } else if (this.role == "Estudiante") {
      this.role = "Maestro";
    }
    this.errorMessage = ''; 
  }
  
  async submit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      if (this.role == "Maestro") {
        await this.loginTeacher(form);
      } else {
        await this.loginStudent(form);
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.errorMessage = 'Error inesperado. Por favor intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }

  private async loginTeacher(form: NgForm) {
    const { email, psw } = form.value;

    if (!email || !psw) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña';
      return;
    }

    const result = await this.authService.login({
      email: email.trim().toLowerCase(),
      contraseña: psw
    });

    if (result.success && result.teacher) {
      console.log('Login exitoso:', result.teacher);
      this.router.navigate(['teacher']);
    } else {
      this.errorMessage = result.message;
    }
  }

  private async loginStudent(form: NgForm) {
    const { firstName, psw } = form.value;

    if (!firstName || !psw) {
      this.errorMessage = 'Por favor ingresa tu nombre y apellidos';
      return;
    }

    console.log('Login de estudiante:', { firstName, psw });
    
    this.router.navigate(['student']);
  }
}