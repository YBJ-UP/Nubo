import { Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MemoramaData } from '../../interfaces/memorama';

@Component({
  selector: 'app-cards-memorama',
  imports: [CommonModule, RouterModule ],
  templateUrl: './cards-memorama.html',
  styleUrl: './cards-memorama.css'
})
export class CardsMemorama {
 @Input() data!: MemoramaData; 
 constructor(private router: Router) { } 
  iniciarRonda(): void {
    const rutaActividad = `/student/juegos-ludicos/memorama/${this.data.rondaId}`;
    this.router.navigate([rutaActividad]);
  }
}