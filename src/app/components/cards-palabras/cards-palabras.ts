import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

export interface PalabraData {
  id: number;
  titulo: string;
  colorFondo: string; 
  imagenUrl?: string;
  enlace: string; 
}

@Component({
  selector: 'app-cards-palabras',
  imports: [CommonModule, RouterModule],
  templateUrl: './cards-palabras.html',
  styleUrl: './cards-palabras.css'
})
export class CardsPalabras implements OnInit{
  
  @Input() palabraData!: PalabraData;
  constructor(private router: Router) { }
  ngOnInit(): void { }
  navegar(): void {
    const rutaEjercicio = `/student/actividad/${this.palabraData.id}`;
    console.log(`Navegando al ejercicio: ${rutaEjercicio}`);
    this.router.navigate([rutaEjercicio]);
  }

}
