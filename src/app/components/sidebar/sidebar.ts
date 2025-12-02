import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private router: Router, private teacher: TeacherAuthService){}
  choices = {
    home: 1,
    students: 2
  }
  
  selected = this.choices.home
  toStudents(): void {
    if (this.selected == this.choices.home) { this.selected = this.choices.students; this.router.navigate(["../teacher/students"]) }
  }
  toHome(): void {
    if (this.selected == this.choices.students) { this.selected = this.choices.home; this.router.navigate(["../teacher"]) }
  }

  logout(): void {
    this.teacher.logout()
  }
}