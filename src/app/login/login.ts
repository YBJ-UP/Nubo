import { Component } from '@angular/core';
import { Cloud } from "../components/cloud/cloud";
import { RouterLink, Router } from "@angular/router";
import { FormsModule, NgForm } from '@angular/forms';
import { LoginType } from "../components/login-type/login-type";
import { Nube } from "../components/nube/nube";

@Component({
  selector: 'app-login',
  imports: [Cloud, RouterLink, FormsModule, LoginType, Nube],
  templateUrl: './login.html',
  styleUrl: '../register/register.css'
})
export class Login {
  constructor(private router: Router){}
  
  submit(form: NgForm){
    console.log(form.value)
    this.router.navigate(['home/teacher'])
  }
}
