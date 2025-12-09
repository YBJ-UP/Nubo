
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MemoramaData } from '../../interfaces/memorama'; 
import { CardsMemorama } from '../../components/cards-memorama/cards-memorama';
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-galeria-juegos',
  imports: [CommonModule, CardsMemorama, RouterModule, FloatingMessage],
  templateUrl: './galeria-juegos.html',
  styleUrls: ['./galeria-juegos.css']
})
export class GaleriaJuegos {
  rondas : MemoramaData[] =[]; 
  constructor() {}
  
}