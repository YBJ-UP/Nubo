
import { Injectable } from '@angular/core';
import { PalabraCompleta } from '../actividades/actividad.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityMapperService {
  
  convertToApiFormat(localContent: any[]): any[] {
    return localContent.map(item => ({
      texto: item.palabra || item.texto,
      imagenUrl: item.imagenUrl,
      syllables: item.syllables?.map((s: any) => s.texto) || [],
      graphemes: item.fonemas?.map((f: any) => f.texto) || []
    }));
  }

  convertToLocalFormat(apiActivity: any): any {
    return {
      id: apiActivity.id,
      titulo: apiActivity.title,
      imagenPortada: apiActivity.thumbnail,
      palabrasCompletas: apiActivity.content.map((item: any, index: number) => ({
        id: index + 1,
        palabra: item.texto,
        imagenUrl: item.imagenUrl,
        syllables: item.syllables.map((s: string, i: number) => ({ id: i, texto: s })),
        fonemas: item.graphemes.map((g: string, i: number) => ({ id: i, texto: g }))
      })),
      fechaCreacion: new Date(),
      sincronizado: true
    };
  }

  convertArrayToLocalFormat(apiActivities: any[]): any[] {
    return apiActivities.map(activity => this.convertToLocalFormat(activity));
  }
}