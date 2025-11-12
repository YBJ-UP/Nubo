import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-student-home',
  standalone: true,
  imports: [RouterModule, Header],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome { }