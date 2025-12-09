import { Injectable } from '@angular/core';
import { PalabraCompleta } from '../../interfaces/actividad-completa';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ActivityValidationService {
  private readonly DEFAULT_IMAGE = 'perfil.jpg';

  validateActivityForm(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!titulo.trim()) {
      errors.push('Por favor, ingresa un título para la actividad');
    }

    if (!imagenPortada || imagenPortada === this.DEFAULT_IMAGE) {
      errors.push('Por favor, sube una imagen de portada para la actividad');
    }

    if (palabrasCompletas.length === 0) {
      errors.push('Debes agregar al menos una palabra a la actividad');
    }

    palabrasCompletas.forEach((palabra, index) => {
      const wordErrors = this.validatePalabraCompleta(palabra, index + 1);
      errors.push(...wordErrors);
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validatePalabraCompleta(palabra: PalabraCompleta, position: number): string[] {
    const errors: string[] = [];

    if (!palabra.palabra.trim()) {
      errors.push(`Palabra ${position}: La palabra principal no puede estar vacía`);
    }

    const syllablesCompletas = palabra.syllables.filter(s => s.texto.trim());
    if (syllablesCompletas.length === 0) {
      errors.push(`Palabra ${position}: Debes agregar al menos una sílaba`);
    }

    const fonemasCompletos = palabra.fonemas.filter(f => f.texto.trim());
    if (fonemasCompletos.length === 0) {
      errors.push(`Palabra ${position}: Debes agregar al menos un fonema`);
    }

    if (palabra.imagenUrl === this.DEFAULT_IMAGE) {
      errors.push(`Palabra ${position}: Debes subir una imagen para esta palabra`);
    }

    return errors;
  }

  hasUnsavedChanges(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): boolean {
    if (titulo.trim() !== '') return true;
    if (imagenPortada !== this.DEFAULT_IMAGE) return true;

    return palabrasCompletas.some(p =>
      p.palabra.trim() !== '' ||
      p.imagenUrl !== this.DEFAULT_IMAGE ||
      p.syllables.some(s => s.texto.trim()) ||
      p.fonemas.some(f => f.texto.trim())
    );
  }
}