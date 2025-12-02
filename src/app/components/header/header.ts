import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';
import { StudentAuthService } from '../../services/authentication/student-auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  view = "Hogar"
  name = "Usuario"
  role = "Educador"
  school = "Escuela"

  constructor(private teacher: TeacherAuthService, private student: StudentAuthService){
    if (this.teacher.currentTeacher){
      this.name = this.teacher.currentTeacher.fullname
      this.role = "Educador"
      this.school = this.teacher.currentTeacher.escuela
    }
  }
  
}
