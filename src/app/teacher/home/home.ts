import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";
import { CardsHome } from "../../components/cards-home/cards-home";

@Component({
  selector: 'app-home',
  imports: [Sidebar, Greeting, CardsHome],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
