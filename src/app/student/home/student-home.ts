import { Component } from '@angular/core';
import { Greeting } from "../../components/greeting/greeting";
import { Header } from "../../components/header/header";
import { RouterModule } from "@angular/router";

@Component({
 selector: 'app-student-home',
  standalone: true,
  imports: [Greeting, Header, RouterModule],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {

}
