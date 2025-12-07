
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
      silabas: item.silabas?.map((s: any) => s.texto) || [],
      grafemas: item.fonemas?.map((f: any) => f.texto) || []
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
        silabas: item.silabas.map((s: string, i: number) => ({ id: i, texto: s })),
        fonemas: item.grafemas.map((g: string, i: number) => ({ id: i, texto: g }))
      })),
      fechaCreacion: new Date(),
      sincronizado: true
    };
  }

  convertArrayToLocalFormat(apiActivities: any[]): any[] {
    return apiActivities.map(activity => this.convertToLocalFormat(activity));
  }
}