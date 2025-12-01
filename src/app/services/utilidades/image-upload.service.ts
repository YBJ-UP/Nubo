import { Injectable } from '@angular/core';
import { ActividadFormService } from '../actividades/actividad.service';

export interface ImageUploadResult {
  success: boolean;
  message: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private actividadFormService: ActividadFormService) {}

  async uploadImage(event: Event): Promise<ImageUploadResult> {
    const result = await this.actividadFormService.procesarImagenSeleccionada(event);
    
    return {
      success: result.exito,
      message: result.mensaje,
      imageUrl: result.url
    };
  }

  triggerFileInput(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    input?.click();
  }

  getPortadaInputId(): string {
    return 'portadaInput';
  }

  getWordImageInputId(index: number): string {
    return `imagenInput-${index}`;
  }
}