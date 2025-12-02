import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';
import { StudentAuthService } from '../../services/authentication/student-auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  view = 'Hogar';
  name = 'Usuario';
  role = input('Educador');
  school = 'Escuela';

  constructor(private teacher: TeacherAuthService, private student: StudentAuthService) {}

  ngOnInit(): void {
    console.log(this.role())
    if (this.role() == 'Educador') {
      if (this.teacher.currentTeacher) {
        this.name = this.teacher.currentTeacher.fullname;
        this.school = this.teacher.currentTeacher.escuela;
      }
    }else if (this.role() == "Estudiante"){
      console.log(this.student.currentStudent?.fullName)
      if(this.student.currentStudent?.fullName){
        this.name = this.student.currentStudent.fullName
      }
    }
  }

  logout(): void {
    if (this.role() == "Educador") {
      this.teacher.logout()
    } else if (this.role() == "Estudiante") {
      this.student.logout()
    }
  }
}
