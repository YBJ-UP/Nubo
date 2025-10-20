import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";
import { CardsHome } from "../../components/cards-home/cards-home";

@Component({
 selector: 'app-student-home',
  standalone: true,
  imports: [Sidebar, Greeting, CardsHome],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {

}
