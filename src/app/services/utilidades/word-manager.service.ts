import { Injectable } from '@angular/core';
import { ActividadFormService } from '../actividades/actividad.service';
import { PalabraCompleta, Palabra, Fonema } from '../../interfaces/actividad-completa';

export interface WordOperationResult {
  success: boolean;
  message?: string;
  palabra?: PalabraCompleta;
}

@Injectable({
  providedIn: 'root'
})
export class WordManagerService {
  constructor(private actividadFormService: ActividadFormService) { }

  createEmptyWord(): PalabraCompleta {
    return this.actividadFormService.crearPalabraCompleta();
  }

  addSyllable(palabra: PalabraCompleta): PalabraCompleta {
    const nuevaSilaba = this.actividadFormService.crearPalabraVacia();
    return {
      ...palabra,
      syllables: [...palabra.syllables, nuevaSilaba]
    };
  }

  removeSyllable(palabra: PalabraCompleta, silabaId: number): WordOperationResult {
    if (!this.actividadFormService.puedeEliminarItem(palabra.syllables.length)) {
      return {
        success: false,
        message: 'Debe haber al menos una sílaba'
      };
    }

    const syllables = palabra.syllables.filter(s => s.id !== silabaId);
    return {
      success: true,
      palabra: { ...palabra, syllables }
    };
  }

  addPhoneme(palabra: PalabraCompleta): PalabraCompleta {
    const nuevoFonema = this.actividadFormService.crearFonemaVacio();
    return {
      ...palabra,
      fonemas: [...palabra.fonemas, nuevoFonema]
    };
  }

  removePhoneme(palabra: PalabraCompleta, fonemaId: number): WordOperationResult {
    if (!this.actividadFormService.puedeEliminarItem(palabra.fonemas.length)) {
      return {
        success: false,
        message: 'Debe haber al menos un fonema'
      };
    }

    const fonemas = palabra.fonemas.filter(f => f.id !== fonemaId);
    return {
      success: true,
      palabra: { ...palabra, fonemas }
    };
  }

  updateWordImage(palabra: PalabraCompleta, imageUrl: string): PalabraCompleta {
    return { ...palabra, imagenUrl: imageUrl };
  }

  canRemoveWord(totalWords: number): boolean {
    return totalWords > 1;
  }
}