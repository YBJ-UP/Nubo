import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actividad-palabras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad-palabras.html',
  styleUrl: './actividad-palabras.css'
})
export class ActividadPalabras {
  
  constructor(private location: Location) {}

  regresar(): void {
    this.location.back();
  }
}