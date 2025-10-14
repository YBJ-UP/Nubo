import { Component } from '@angular/core';
import { Sidebar } from "../components/sidebar/sidebar";

@Component({
  selector: 'app-home',
  imports: [Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
