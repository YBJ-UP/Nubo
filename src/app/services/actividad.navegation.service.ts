import { Injectable } from '@angular/core';
import { ProgressService } from './progress.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadNavigationService {
  
  constructor(private progressService: ProgressService) {}
  calcularProgreso(palabraActualIndex: number, totalPalabras: number): number {
    if (!this.progressService.validarIndices(palabraActualIndex, totalPalabras)) {
      return 0;
    }
    return this.progressService.calcularPorcentaje(palabraActualIndex, totalPalabras);
  }

  puedeIrAnterior(palabraActualIndex: number): boolean {
    return palabraActualIndex > 0;
  }

  puedeirSiguiente(palabraActualIndex: number, totalPalabras: number): boolean {
    return palabraActualIndex < totalPalabras - 1;
  }

  esUltimaPalabra(palabraActualIndex: number, totalPalabras: number): boolean {
    return palabraActualIndex === totalPalabras - 1;
  }

  esPrimeraPalabra(palabraActualIndex: number): boolean {
    return palabraActualIndex === 0;
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

  obtenerTextoProgreso(palabraActualIndex: number, totalPalabras: number): string {
    return this.progressService.formatearTextoProgreso(palabraActualIndex, totalPalabras);
  }

  obtenerColorBarraProgreso(palabraActualIndex: number, totalPalabras: number): string {
    const porcentaje = this.calcularProgreso(palabraActualIndex, totalPalabras);
    return this.progressService.obtenerColorProgreso(porcentaje);
  }

  actividadCompletada(palabraActualIndex: number, totalPalabras: number): boolean {
    return this.progressService.estaCompleto(palabraActualIndex, totalPalabras);
  }

  obtenerSiguienteIndice(palabraActualIndex: number, totalPalabras: number): number {
    if (this.puedeirSiguiente(palabraActualIndex, totalPalabras)) {
      return palabraActualIndex + 1;
    }
    return palabraActualIndex;
  }

  obtenerAnteriorIndice(palabraActualIndex: number): number {
    if (this.puedeIrAnterior(palabraActualIndex)) {
      return palabraActualIndex - 1;
    }
    return palabraActualIndex;
  }
}