import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-create-student',
  imports: [Sidebar, Greeting, Header],
  templateUrl: './create-student.html',
  styleUrl: '../home/home.css'
})
export class CreateStudent {

}
