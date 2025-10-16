import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginType } from "../../components/login-type/login-type";
import { Cloud } from '../../components/cloud/cloud';
import { Router } from '@angular/router';
import { Nube } from "../../components/nube/nube";

@Component({
  selector: 'app-students',
  imports: [LoginType, Cloud, FormsModule, Nube],
  templateUrl: './students.html',
  styleUrl: '../../register/register.css'
})
export class Students {
  constructor(private router: Router){}
  selection = signal("student")

  submit(form: NgForm){
      console.log(form.value)
      this.router.navigate(['home/student'])
    }
}
