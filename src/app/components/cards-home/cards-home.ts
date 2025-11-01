import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Greeting } from "../greeting/greeting";


@Component({
  selector: 'app-cards-home',
  imports: [RouterModule, Greeting],
  templateUrl: './cards-home.html',
  styleUrl: './cards-home.css'
})
export class CardsHome {

}
