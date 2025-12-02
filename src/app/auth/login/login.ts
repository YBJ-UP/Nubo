// src/app/auth/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from "@angular/router";
import { Cloud } from "../../components/cloud/cloud";
import { Nube } from "../../components/nube/nube";
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service'
import { StudentAuthService } from '../../services/authentication/student-auth.service';
import { LoadingScreenOverlay } from '../../shared/loading-screen-overlay/loading-screen-overlay';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Cloud, RouterLink, FormsModule, Nube, CommonModule, LoadingScreenOverlay],
  templateUrl: './login.html',
  styleUrl: '../register/register.css'
})
export class Login {
  role = "Maestro";
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private authService: TeacherAuthService,
    private studentAuthService: StudentAuthService
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
    if (form.pristine) {
      this.errorMessage = 'Por favor completa todos los campos.';
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
    const { email, psw, cPsw } = form.value;

    if (!email && !psw) {
      this.errorMessage = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    if (!email) {
      this.errorMessage = 'Ingrese su correo.';
      return;
    }

    if (!psw) {
      this.errorMessage = 'Ingrese su contraseña.';
      return;
    }

    if (!cPsw) {
      this.errorMessage = 'Confirme su contraseña.';
      return;
    }

    if (psw != cPsw) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    const result = await this.authService.login({
      email: email.trim().toLowerCase(),
      contraseña: psw
    });

    if (result.success && result.teacher && result.token) {
      console.log('Login exitoso:', result.teacher);
      console.log('Token recibido:', result.token);
      
      this.router.navigate(['teacher']);
    } else {
      this.errorMessage = result.message;
    }
  }

  private async loginStudent(form: NgForm) {
    const { firstName, psw } = form.value;

    if (!firstName || !psw) {
      this.errorMessage = 'Por favor ingresa tu nombre y apellidos.';
      return;
    }

    const nombres = psw.trim().split(' ');
    const apellidoP = nombres[0] || '';
    const apellidoM = nombres.slice(1).join(' ') || ''; 

    const result = await this.studentAuthService.login({
      nombre: firstName.trim(),
      apellidoP: apellidoP,
      apellidoM: apellidoM
    });

    if (result.success && result.student) {
      console.log('Login de estudiante exitoso:', result.student);
      this.router.navigate(['student']);
    } else {
      this.errorMessage = result.message;
    }
  }
}