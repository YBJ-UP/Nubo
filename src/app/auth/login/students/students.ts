import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-students',
  templateUrl: './students.html',
  styleUrl: '../../../auth/register/register.css',
  standalone: false
})
export class Students {
  constructor(private router: Router){}
  selection = signal("student")

  submit(form: NgForm){
      console.log(form.value)
      this.router.navigate(['home/student'])
    }
}
