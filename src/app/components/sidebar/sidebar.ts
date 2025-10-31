import { Component, input } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private router: Router){}
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
}