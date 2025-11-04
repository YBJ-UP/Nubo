import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";
import { PalabraData } from '../../interfaces/PalabraData';
import { PALABRAS_DATA_MOCK } from '../../data/palabra-data';

@Component({
  selector: 'app-galeria-palabras',
  imports: [CardsPalabras, CommonModule, RouterModule],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})

export class GaleriaPalabras implements OnInit {
  palabras: PalabraData[] = [];
  ngOnInit(): void {
    this.palabras = PALABRAS_DATA_MOCK;
    console.log("datos cargados");
  }

}
