import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: '../../auth/register/register.css',
  standalone: false
})
export class Login {
  constructor(private router: Router) {};
  
  submit(form: NgForm){
    console.log(form.value);
    this.router.navigate(['home/teacher']);
  }
}
