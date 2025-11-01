import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Header } from "../../components/header/header";

@Component({
  selector: 'app-create-student',
  imports: [Sidebar, Header],
  templateUrl: './create-student.html',
  styleUrl: '../home/home.css'
})
export class CreateStudent {

}

