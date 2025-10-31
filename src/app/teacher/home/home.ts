import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";
import { Header } from "../../components/header/header";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Sidebar, Greeting, Header, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
