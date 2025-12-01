import { Injectable } from '@angular/core';

interface ImageValidationResult {
  valid: boolean;
  message: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  validateImage(file: File): ImageValidationResult {
    if (!file) {
      return { valid: false, message: 'No se seleccionó ningún archivo' };
    }

    if (file.size > this.MAX_SIZE) {
      return { 
        valid: false, 
        message: 'La imagen es demasiado grande. El tamaño máximo es 5MB' 
      };
    }

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        message: 'Formato no válido. Solo se permiten JPG, PNG, GIF y WebP' 
      };
    }

    return { valid: true, message: 'Imagen válida' };
  }

  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve(result);
      };
      
      reader.onerror = (error) => {
        reject(new Error('Error al leer el archivo'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  async processImage(file: File): Promise<ImageValidationResult> {
    const validation = this.validateImage(file);
    
    if (!validation.valid) {
      return validation;
    }

    try {
      const base64 = await this.convertToBase64(file);
      return { 
        valid: true, 
        message: 'Imagen cargada exitosamente', 
        imageUrl: base64 
      };
    } catch (error) {
      return { 
        valid: false, 
        message: 'Error al procesar la imagen. Intenta de nuevo.' 
      };
    }
  }

  getDefaultAvatar(): string {
    return 'raul.jpg';
  }
}