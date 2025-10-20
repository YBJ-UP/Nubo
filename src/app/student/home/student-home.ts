import { Component } from '@angular/core';
import { Greeting } from "../../components/greeting/greeting";
import { CardsHome } from "../../components/cards-home/cards-home";
import { Header } from "../../components/header/header";

@Component({
 selector: 'app-student-home',
  standalone: true,
  imports: [Greeting, CardsHome, Header],
  templateUrl: './student-home.html',
  styleUrls: ['./student-home.css']
})
export class StudentHome {

}
