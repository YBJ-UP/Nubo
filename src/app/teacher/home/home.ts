import { Component, signal } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { Header } from "../../components/header/header";
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Sidebar, Header, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  getData(): string {
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
  }
}
