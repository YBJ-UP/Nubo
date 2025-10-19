import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";

@Component({
  selector: 'app-home',
  imports: [Sidebar, Greeting],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
