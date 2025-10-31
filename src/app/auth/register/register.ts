import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: false
})
export class Register {
  constructor(private router: Router) {};

  submit(form: NgForm){
    console.log(form.value)
    this.router.navigate(['home/teacher']);
  }
}