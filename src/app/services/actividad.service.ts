import { Injectable } from '@angular/core';

export interface Palabra {
  id: number;
  texto: string;
}

export interface Fonema {
  id: number;
  texto: string;
}

export interface ActividadCompleta {
  id: number;
  titulo: string;
  imagenPrincipal: string;
  palabras: Palabra[];
  fonemas: Fonema[];
  fechaCreacion: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadFormService {

  constructor() { }

  generarId(): number {
    return Date.now() + Math.random();
  }

  crearPalabraVacia(): Palabra {
    return {
      id: this.generarId(),
      texto: ''
    };
  }

  crearFonemaVacio(): Fonema {
    return {
      id: this.generarId(),
      texto: ''
    };
  }

  validarImagen(file: File): { valido: boolean; mensaje?: string } {
    if (file.size > 5 * 1024 * 1024) {
      return {
        valido: false,
        mensaje: 'La imagen es demasiado grande. El tamaño máximo es 5MB.'
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        valido: false,
        mensaje: 'Por favor selecciona un archivo de imagen válido.'
      };
    }

    return { valido: true };
  }

  convertirImagenABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  validarActividad(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string
  ): { valido: boolean; mensaje?: string } {
    
    if (!titulo.trim()) {
      return {
        valido: false,
        mensaje: 'Por favor, ingresa un título para la actividad'
      };
    }

    const palabrasCompletas = palabras.filter(p => p.texto.trim());
    if (palabrasCompletas.length === 0) {
      return {
        valido: false,
        mensaje: 'Por favor, agrega al menos una sílaba'
      };
    }

    const fonemasCompletos = fonemas.filter(f => f.texto.trim());
    if (fonemasCompletos.length === 0) {
      return {
        valido: false,
        mensaje: 'Por favor, agrega al menos un fonema'
      };
    }

    return { valido: true };
  }

  crearObjetoActividad(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string
  ): ActividadCompleta {
    const palabrasCompletas = palabras.filter(p => p.texto.trim());
    const fonemasCompletos = fonemas.filter(f => f.texto.trim());

    return {
      id: Date.now(),
      titulo: titulo.trim(),
      imagenPrincipal: imagenUrl,
      palabras: palabrasCompletas,
      fonemas: fonemasCompletos,
      fechaCreacion: new Date()
    };
  }

  guardarActividad(actividad: ActividadCompleta): boolean {
    try {
      const actividadesGuardadas = localStorage.getItem('actividades_cognitivas');
      const actividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
      
      actividades.push(actividad);
      localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));

      console.log('Actividad guardada exitosamente:', actividad);
      return true;
    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      return false;
    }
  }

  hayaCambiosSinGuardar(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string,
    imagenDefault: string
  ): boolean {
    if (titulo.trim()) return true;
    if (imagenUrl !== imagenDefault) return true;
    if (palabras.some(p => p.texto.trim())) return true;
    if (fonemas.some(f => f.texto.trim())) return true;
    return false;
  }

  limpiarDatos(): void {
    console.log('Datos limpiados');
  }
}