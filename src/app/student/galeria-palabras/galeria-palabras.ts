import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";


export interface PalabraData {
  id: number;
  titulo: string;
  colorFondo: string; 
  imagenUrl?: string; 
  enlace: string; 
}
@Component({
  selector: 'app-galeria-palabras',
  imports: [CardsPalabras, CommonModule, RouterModule],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})

export class GaleriaPalabras {
  palabras: PalabraData[]=[
   { 
      id: 1, 
      titulo: 'Actividad 1: Fonemas', 
      colorFondo: '#BDE0FE', 
      imagenUrl: '1', // Ruta de la imagen del perro
      enlace: '/actividad-1' 
    },
    { 
      id: 2, 
      titulo: 'Actividad 2: Fonemas y Sílabas', 
      colorFondo: '#F78C8C', 
      enlace: '/actividad-2' 
    },
    { 
      id: 3, 
      titulo: 'Actividad 3: Sílabas y palabras', 
      colorFondo: '#D4BFFF', 
      enlace: '/actividad-3' 
    },
    { 
      id: 4, 
      titulo: 'Actividad 1: Fonemas', 
      colorFondo: '#FEF9C3', 
      enlace: '/actividad-1b' 
    }
  ];
  ngOnInit():void{}
}
