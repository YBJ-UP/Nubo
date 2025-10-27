import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../components/header/header';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";

@Component({
  selector: 'app-galeria-palabras',
  imports: [Header,CardsPalabras],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})
export class GaleriaPalabras {

}
