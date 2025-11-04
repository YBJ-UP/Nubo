import { Component } from '@angular/core';
import { Header } from "../../components/header/header";
import { RouterModule } from "@angular/router";

@Component({
 selector: 'app-student-home',
  standalone: true,
  imports: [Header, RouterModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {

}
