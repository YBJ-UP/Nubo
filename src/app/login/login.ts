import { Component, signal } from '@angular/core';
import { Cloud } from "../components/cloud/cloud";
import { RouterLink, Router } from "@angular/router";
import { FormsModule, NgForm } from '@angular/forms';
import { Nube } from "../components/nube/nube";

@Component({
  selector: 'app-login',
  imports: [Cloud, RouterLink, FormsModule, Nube],
  templateUrl: './login.html',
  styleUrl: '../auth/register/register.css'
})
export class Login {

  role ="Maestro" 

  swicthRole(): void {
    if (this.role == "Maestro"){
      this.role = "Estudiante"
    }else if (this.role == "Estudiante"){
      this.role = "Maestro"
    }
  }
  
  constructor(private router: Router){}
  
  submit(form: NgForm){
    if (this.role == "Maestro"){
      console.log(this.role)
      console.log(form.value)
      this.router.navigate(['teacher'])
    }else{
      console.log(this.role)
      console.log(form.value)
      this.router.navigate(['student'])
    }
    
  }
}
