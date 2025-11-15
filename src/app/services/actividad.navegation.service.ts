import { Injectable } from '@angular/core';
import { PalabraCompleta } from './actividad.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadNavigationService {
  
  calcularProgreso(palabraActualIndex: number, totalPalabras: number): number {
    if (totalPalabras === 0) return 0;
    return Math.round(((palabraActualIndex + 1) / totalPalabras) * 100);
  }

  puedeIrAnterior(palabraActualIndex: number): boolean {
    return palabraActualIndex > 0;
  }

  puedeirSiguiente(palabraActualIndex: number, totalPalabras: number): boolean {
    return palabraActualIndex < totalPalabras - 1;
  }

  obtenerColorSilaba(index: number): string {
    const colores = ['color-green', 'color-blue', 'color-purple', 'color-yellow'];
    return colores[index % colores.length];
  }

  obtenerColorFonema(index: number): string {
    const colores = ['color-green', 'color-blue', 'color-purple', 'color-yellow'];
    const silabaIndex = Math.floor(index / 2);
    return colores[silabaIndex % colores.length];
  }

  obtenerColorAleatorio(): string {
    const colores = [
      '#BDE0FE', '#F78C8C', '#D4BFFF', 
      '#FEF9C3', '#D9F7C4', '#C3D4FE'
    ];
    return colores[Math.floor(Math.random() * colores.length)];
  }
}