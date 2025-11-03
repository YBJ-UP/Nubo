// galeria-juegos.ts (MODIFICADO)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// 🚨 1. Importar la Interfaz para tipado
import { MemoramaData } from '../../interfaces/memorama'; 
// 🚨 2. Importar el MOCK de Datos
import { MEMORAMA_DATA_MOCK } from '../../data/memorama-data'; 

import { CardsMemorama } from '../../components/cards-memorama/cards-memorama';

@Component({
  selector: 'app-galeria-juegos',
  imports: [CommonModule, CardsMemorama, RouterModule],
  templateUrl: './galeria-juegos.html',
  styleUrl: './galeria-juegos.css'
})
export class GaleriaJuegos  implements OnInit {
  rondas : MemoramaData[] =[]; 
  constructor() {}
  ngOnInit(): void {this.cargarRondas();}
  
  cargarRondas(): void {
    this.rondas = MEMORAMA_DATA_MOCK;
    console.log(`Cargadas ${this.rondas.length} rondas de memorama.`);
  }
}