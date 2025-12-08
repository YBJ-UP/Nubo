import { Injectable } from '@angular/core';

export interface Palabra {
  id: number;
  texto: string;
}

export interface Fonema {
  id: number;
  texto: string;
}

export interface PalabraCompleta {
  id: number;
  palabra: string;
  imagenUrl: string;
  syllables: Palabra[];
  fonemas: Fonema[];
}

export interface ActividadCompleta {
  sincronizado: boolean;
  id: number;
  titulo: string;
  imagenPortada: string;
  palabrasCompletas: PalabraCompleta[];
  fechaCreacion: Date;
}

interface ResultadoOperacion {
  exito: boolean;
  mensaje: string;
  url?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ActividadFormService {
  private readonly STORAGE_KEY = 'actividades_cognitivas';
  private readonly IMAGEN_DEFAULT = 'perfil.jpg';
  private readonly MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  generarId(): number {
    return Date.now();
  }

  crearPalabraVacia(): Palabra {
    return { id: this.generarId(), texto: '' };
  }

  crearFonemaVacio(): Fonema {
    return { id: this.generarId(), texto: '' };
  }

  crearPalabraCompleta(): PalabraCompleta {
    return {
      id: this.generarId(),
      palabra: '',
      imagenUrl: this.IMAGEN_DEFAULT,
      syllables: this.inicializarPalabras(3),
      fonemas: this.inicializarFonemas(4)
    };
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

  private validarPalabraCompleta(palabraCompleta: PalabraCompleta): string | null {
    if (!palabraCompleta.palabra.trim()) {
      return 'La palabra principal no puede estar vacía';
    }

    const syllablesCompletas = palabraCompleta.syllables.filter(s => s.texto.trim());
    if (syllablesCompletas.length === 0) {
      return 'Debes agregar al menos una sílaba';
    }

    const fonemasCompletos = palabraCompleta.fonemas.filter(f => f.texto.trim());
    if (fonemasCompletos.length === 0) {
      return 'Debes agregar al menos un fonema';
    }

    if (palabraCompleta.imagenUrl === this.IMAGEN_DEFAULT) {
      return 'Debes subir una imagen para esta palabra';
    }

    return null;
  }

  private validarFormulario(
    titulo: string,
    palabrasCompletas: PalabraCompleta[]
  ): ResultadoOperacion {
    if (!titulo.trim()) {
      return {
        exito: false,
        mensaje: 'Por favor, ingresa un título para la actividad'
      };
    }

    if (palabrasCompletas.length === 0) {
      return {
        exito: false,
        mensaje: 'Debes agregar al menos una palabra a la actividad'
      };
    }

    for (let i = 0; i < palabrasCompletas.length; i++) {
      const error = this.validarPalabraCompleta(palabrasCompletas[i]);
      if (error) {
        return {
          exito: false,
          mensaje: `Palabra ${i + 1}: ${error}`
        };
      }
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

  private limpiarPalabraCompleta(palabra: PalabraCompleta): PalabraCompleta {
    return {
      ...palabra,
      palabra: palabra.palabra.trim(),
      syllables: palabra.syllables.filter(s => s.texto.trim()),
      fonemas: palabra.fonemas.filter(f => f.texto.trim())
    };
  }

  private crearObjetoActividad(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): ActividadCompleta {
    return {
      id: this.generarId(),
      titulo: titulo.trim(),
      imagenPortada: imagenPortada, 
      palabrasCompletas: palabrasCompletas.map(p => this.limpiarPalabraCompleta(p)),
      fechaCreacion: new Date(),
      sincronizado: false // <--- CORRECCIÓN AQUÍ: Faltaba esta propiedad
    };
  }

  private guardarEnStorage(actividad: ActividadCompleta): boolean {
    try {
      const actividadesGuardadas = localStorage.getItem(this.STORAGE_KEY);
      const actividades = actividadesGuardadas ? JSON.parse(actividadesGuardadas) : [];
      
      actividades.push(actividad);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actividades));
      
      console.log('Actividad guardada exitosamente:', {
        id: actividad.id,
        titulo: actividad.titulo,
        palabras: actividad.palabrasCompletas.length
      });
      return true;
    } catch (error) {
      console.error('Error al guardar la actividad:', error);
      return false;
    }
  }

  async guardarActividadCompleta(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<ResultadoOperacion> {
    const validacion = this.validarFormulario(titulo, palabrasCompletas);
    if (!validacion.exito) {
      return validacion;
    }

    if (!imagenPortada || imagenPortada === this.IMAGEN_DEFAULT) {
      return {
        exito: false,
        mensaje: 'Por favor, sube una imagen de portada para la actividad'
      };
    }

    const actividad = this.crearObjetoActividad(titulo, imagenPortada, palabrasCompletas);
    const guardado = this.guardarEnStorage(actividad);

    if (guardado) {
      return { 
        exito: true, 
        mensaje: `Actividad creada exitosamente con ${palabrasCompletas.length} palabra(s)`,
        data: actividad
      };
    } else {
      return {
        exito: false,
        mensaje: 'Error al guardar la actividad. Por favor, intenta de nuevo.'
      };
    }
  }

  getAllActividades(): ActividadCompleta[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getActividadById(id: number): ActividadCompleta | undefined {
    const actividades = this.getAllActividades();
   
    let actividad = actividades.find(a => a.id === id);
    
    if (!actividad) {
      actividad = actividades.find(a => String(a.id) === String(id));
    }
    
    if (!actividad) {
      actividad = actividades.find(a => Math.floor(a.id) === Math.floor(id));
    }
    
    return actividad;
  }

  deleteActividad(id: number): boolean {
    try {
      const actividades = this.getAllActividades();
      const filtered = actividades.filter(a => a.id !== id);
      
      if (filtered.length === actividades.length) {
        return false;
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      console.log('Actividad eliminada:', id);
      return true;
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      return false;
    }
  }

  hayaCambiosSinGuardar(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): boolean {
    if (titulo.trim() !== '') return true;
    if (imagenPortada !== this.IMAGEN_DEFAULT) return true;
    
    return palabrasCompletas.some(p => 
      p.palabra.trim() !== '' ||
      p.imagenUrl !== this.IMAGEN_DEFAULT ||
      p.syllables.some(s => s.texto.trim()) ||
      p.fonemas.some(f => f.texto.trim())
    );
  }
}