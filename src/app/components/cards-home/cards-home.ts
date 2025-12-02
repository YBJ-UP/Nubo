import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Greeting } from "../greeting/greeting";
import { NavigationService } from '../../services/navigation/navigation-service';


@Component({
  selector: 'app-cards-home',
  imports: [RouterModule, Greeting],
  templateUrl: './cards-home.html',
  styleUrl: './cards-home.css'
})
export class CardsHome {
  constructor(private nav: NavigationService){
    this.nav.currentView.set('Hogar')
  }
}
