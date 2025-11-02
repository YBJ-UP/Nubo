import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemoramaData } from '../../data/memorama-data';

@Component({
  selector: 'app-cards-memorama',
  imports: [CommonModule ],
  templateUrl: './cards-memorama.html',
  styleUrl: './cards-memorama.css'
})
export class CardsMemorama {
 @Input() data!: MemoramaData; 

  iniciarRonda(): void {
    // Usar this.data.rondaId o this.data.id para navegar a la actividad
    console.log(`Iniciando ronda ID: ${this.data.rondaId}`);
    // this.router.navigate(['/memorama', this.data.rondaId]);
  }
}