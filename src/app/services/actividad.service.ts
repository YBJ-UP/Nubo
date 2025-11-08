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

interface ResultadoOperacion {
  exito: boolean;
  mensaje: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadFormService {
  private readonly STORAGE_KEY = 'actividades_cognitivas';
  private readonly IMAGEN_DEFAULT = 'perfil.jpg';
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

  // === GENERACIÓN DE DATOS ===
  private generarId(): number {
    return Date.now() + Math.random();
  }

  crearPalabraVacia(): Palabra {
    return { id: this.generarId(), texto: '' };
  }

  crearFonemaVacio(): Fonema {
    return { id: this.generarId(), texto: '' };
  }

  inicializarPalabras(cantidad: number): Palabra[] {
    return Array.from({ length: cantidad }, () => this.crearPalabraVacia());
  }

  inicializarFonemas(cantidad: number): Fonema[] {
    return Array.from({ length: cantidad }, () => this.crearFonemaVacio());
  }

  puedeEliminarItem(cantidadActual: number): boolean {
    return cantidadActual > 1;
  }

  private validarImagen(file: File): ResultadoOperacion {
    if (file.size > this.MAX_IMAGE_SIZE) {
      return {
        exito: false,
        mensaje: 'La imagen es demasiado grande. El tamaño máximo es 5MB.'
      };
    }

    if (!file.type.startsWith('image/')) {
      return {
        exito: false,
        mensaje: 'Por favor selecciona un archivo de imagen válido.'
      };
    }

    return { exito: true, mensaje: 'Imagen válida' };
  }

  private validarFormulario(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[]
  ): ResultadoOperacion {
    if (!titulo.trim()) {
      return {
        exito: false,
        mensaje: 'Por favor, ingresa un título para la actividad'
      };
    }

    const palabrasCompletas = palabras.filter(p => p.texto.trim());
    if (palabrasCompletas.length === 0) {
      return {
        exito: false,
        mensaje: 'Por favor, agrega al menos una sílaba'
      };
    }

    const fonemasCompletos = fonemas.filter(f => f.texto.trim());
    if (fonemasCompletos.length === 0) {
      return {
        exito: false,
        mensaje: 'Por favor, agrega al menos un fonema'
      };
    }

    return { exito: true, mensaje: 'Formulario válido' };
  }

  async procesarImagenSeleccionada(event: Event): Promise<ResultadoOperacion> {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) {
      return { exito: false, mensaje: 'No se seleccionó ninguna imagen' };
    }

    const file = input.files[0];
    const validacion = this.validarImagen(file);
    
    if (!validacion.exito) {
      return validacion;
    }

    try {
      const url = await this.convertirImagenABase64(file);
      return { exito: true, mensaje: 'Imagen cargada exitosamente', url };
    } catch (error) {
      console.error('Error al cargar imagen:', error);
      return {
        exito: false,
        mensaje: 'Error al cargar la imagen. Por favor, intenta de nuevo.'
      };
    }
  }

  private convertirImagenABase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  private crearObjetoActividad(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string
  ): ActividadCompleta {
    return {
      id: this.generarId(),
      titulo: titulo.trim(),
      imagenPrincipal: imagenUrl,
      palabras: palabras.filter(p => p.texto.trim()),
      fonemas: fonemas.filter(f => f.texto.trim()),
      fechaCreacion: new Date()
    };
  }

  private guardarEnStorage(actividad: ActividadCompleta): boolean {
    try {
      const actividadesGuardadas = localStorage.getItem(this.STORAGE_KEY);
      const actividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
      
      actividades.push(actividad);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actividades));
      
      console.log('Actividad guardada exitosamente:', actividad);
      return true;
    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      return false;
    }
  }

  async guardarActividadCompleta(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string
  ): Promise<ResultadoOperacion> {
    const validacion = this.validarFormulario(titulo, palabras, fonemas);
    if (!validacion.exito) {
      return validacion;
    }

    if (imagenUrl === this.IMAGEN_DEFAULT) {
      const continuar = confirm('No has subido una imagen. ¿Deseas continuar sin imagen?');
      if (!continuar) {
        return { exito: false, mensaje: 'Guardado cancelado por el usuario' };
      }
    }

    const actividad = this.crearObjetoActividad(titulo, palabras, fonemas, imagenUrl);
    const guardado = this.guardarEnStorage(actividad);

    if (guardado) {
      return { exito: true, mensaje: 'Actividad guardada exitosamente' };
    } else {
      return {
        exito: false,
        mensaje: 'Error al guardar la actividad. Por favor, intenta de nuevo.'
      };
    }
  }

  hayaCambiosSinGuardar(
    titulo: string,
    palabras: Palabra[],
    fonemas: Fonema[],
    imagenUrl: string
  ): boolean {
    return (
      titulo.trim() !== '' ||
      imagenUrl !== this.IMAGEN_DEFAULT ||
      palabras.some(p => p.texto.trim()) ||
      fonemas.some(f => f.texto.trim())
    );
  }
}