import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PalabraData } from '../../interfaces/PalabraData';

@Component({
  selector: 'app-cards-palabras',
  imports: [CommonModule, RouterModule],
  templateUrl: './cards-palabras.html',
  styleUrl: './cards-palabras.css'
})
export class CardsPalabras implements OnInit{
  
  @Input() palabraData!: PalabraData;
  constructor(private router: Router) { }
  ngOnInit(): void {}
  
  navegar(): void {
    const rutaActual = this.router.url;
    const esProfesor = rutaActual.includes('/teacher');
    
    const baseRuta = esProfesor ? '/teacher' : '/student';
    const rutaCompleta = `${baseRuta}/cognitive-abilities/actividad/${this.palabraData.id}`;
    
    console.log(`Navegando a: ${rutaCompleta}`);
    this.router.navigate([rutaCompleta]);
  }
}