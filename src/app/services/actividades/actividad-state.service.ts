import { Injectable } from '@angular/core';
import { PalabraCompleta } from '../../interfaces/actividad-completa';
import { ProgressData } from '../utilidades/progress.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadStateService {
  private actividadId: string | number = 0;
  private tituloActividad: string = '';
  private palabras: PalabraCompleta[] = [];
  private palabraActualIndex: number = 0;
  private progreso: number = 0;
  private progressData: ProgressData | null = null;

  constructor() { }

  getActividadId(): string | number {
    return this.actividadId;
  }

  getTituloActividad(): string {
    return this.tituloActividad;
  }

  getPalabras(): PalabraCompleta[] {
    return this.palabras;
  }

  getPalabraActual(): PalabraCompleta | null {
    if (this.palabraActualIndex >= 0 && this.palabraActualIndex < this.palabras.length) {
      return this.palabras[this.palabraActualIndex];
    }
    return null;
  }

  getPalabraActualIndex(): number {
    return this.palabraActualIndex;
  }

  getTotalPalabras(): number {
    return this.palabras.length;
  }

  getProgreso(): number {
    return this.progreso;
  }

  getProgressData(): ProgressData | null {
    return this.progressData;
  }

  setActividadId(id: string | number): void {
    this.actividadId = id;
  }

  setTituloActividad(titulo: string): void {
    this.tituloActividad = titulo;
  }

  setPalabras(palabras: PalabraCompleta[]): void {
    this.palabras = palabras;
  }

  setPalabraActualIndex(index: number): void {
    if (index >= 0 && index < this.palabras.length) {
      this.palabraActualIndex = index;
    }
  }

  setProgreso(progreso: number): void {
    this.progreso = progreso;
  }

  setProgressData(data: ProgressData): void {
    this.progressData = data;
  }

  resetState(): void {
    this.actividadId = 0;
    this.tituloActividad = '';
    this.palabras = [];
    this.palabraActualIndex = 0;
    this.progreso = 0;
    this.progressData = null;
  }
}