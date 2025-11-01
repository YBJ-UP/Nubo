import { Component } from '@angular/core';
import { Cloud } from '../../components/cloud/cloud';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Nube } from '../../components/nube/nube';

@Component({
  selector: 'app-register',
  imports: [Cloud, RouterLink, FormsModule, Nube],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  constructor(private router: Router) {};

  submit(form: NgForm){
    console.log(form.value)
    const data = {
      firstName: "eso",
      lastName: "tilín",
      email: "correo@correo.com",
      school: "Universidad Politécnica de Chiapas",
      password: "1234567890"
    }
    localStorage.setItem("loginData", JSON.stringify(data))
    this.router.navigate(['teacher']);
  }
}