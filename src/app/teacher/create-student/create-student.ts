import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { CardsHome } from "../../components/cards-home/cards-home";
import { Greeting } from "../../components/greeting/greeting";
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-create-student',
  imports: [Sidebar, CardsHome, Greeting, Header],
  templateUrl: './create-student.html',
  styleUrl: '../home/home.css'
})
export class CreateStudent {

}

