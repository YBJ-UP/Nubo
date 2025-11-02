import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoramaData, MEMORAMA_DATA_MOCK } from '../../data/memorama-data';
import { CardsMemorama } from '../../components/cards-memorama/cards-memorama';

@Component({
  selector: 'app-galeria-juegos',
  imports: [CommonModule, CardsMemorama],
  templateUrl: './galeria-juegos.html',
  styleUrl: './galeria-juegos.css'
})
export class GaleriaJuegos {
public rondas: MemoramaData[] = MEMORAMA_DATA_MOCK;
}
