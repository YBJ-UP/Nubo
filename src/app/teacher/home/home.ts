import { Component, signal } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Greeting } from "../../components/greeting/greeting";
import { Header } from "../../components/header/header";
import { RouterModule } from "@angular/router";
import { Teacher } from '../../interfaces/teacher';

@Component({
  selector: 'app-home',
  imports: [Sidebar, Greeting, Header, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  /*getData(): string {
    if (typeof this.data === "string"){
      return JSON.parse(this.data)
    }else{
      return ''
    }
  }
  
  private readonly data = localStorage.getItem("loginData")
  private readonly name: string = this.getData();

  saySmth(): void {
    console.log(this.data)
    console.log(this.name)
  }*/
}
