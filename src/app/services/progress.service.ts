import { Injectable } from '@angular/core';

export interface ProgressData {
  palabraActual: number;
  totalPalabras: number;
  porcentaje: number;
  palabrasCompletadas: number;
  palabrasFaltantes: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  calcularPorcentaje(palabraActualIndex: number, totalPalabras: number): number {
    if (totalPalabras === 0) return 0;

    const palabraActual = palabraActualIndex + 1;
    const porcentaje = (palabraActual / totalPalabras) * 100;
    return Math.round(porcentaje * 100) / 100;
  }

  obtenerDatosProgreso(palabraActualIndex: number, totalPalabras: number): ProgressData {
    return {
      palabraActual: palabraActualIndex + 1,
      totalPalabras: totalPalabras,
      porcentaje: this.calcularPorcentaje(palabraActualIndex, totalPalabras)
    };
  }

  estaCompleto(palabraActualIndex: number, totalPalabras: number): boolean {
    return (palabraActualIndex + 1) >= totalPalabras;
  }

  palabrasFaltantes(palabraActualIndex: number, totalPalabras: number): number {
    const palabrasCompletadas = palabraActualIndex + 1;
    return Math.max(0, totalPalabras - palabrasCompletadas);
  }


  formatearTextoProgreso(palabraActualIndex: number, totalPalabras: number): string {
    const datos = this.obtenerDatosProgreso(palabraActualIndex, totalPalabras);
    return `Palabra ${datos.palabraActual} de ${datos.totalPalabras} (${datos.porcentaje.toFixed(0)}%)`;
  }

  obtenerColorProgreso(porcentaje: number): string {
    if (porcentaje < 33) {
      return '#F28B8B'; 
    } else if (porcentaje < 66) {
      return '#FFD0A7'; 
    } else if (porcentaje < 100) {
      return '#D6DC82'; 
    } else {
      return '#A2D8F2';
    }
  }

  validarIndices(palabraActualIndex: number, totalPalabras: number): boolean {
    if (totalPalabras <= 0) {
      console.error('El total de palabras debe ser mayor a 0');
      return false;
    }
    
    if (palabraActualIndex < 0) {
      console.error('El índice de palabra actual no puede ser negativo');
      return false;
    }
    
    if (palabraActualIndex >= totalPalabras) {
      console.warn('El índice de palabra actual excede el total de palabras');
      return false;
    }
    
    return true;
  }

  calcularTiempoEstimado(palabraActualIndex: number, totalPalabras: number): number {
    const palabrasRestantes = this.palabrasFaltantes(palabraActualIndex, totalPalabras);
    const segundosPorPalabra = 30;
    return palabrasRestantes * segundosPorPalabra;
  }

  formatearTiempoEstimado(segundos: number): string {
    if (segundos < 60) {
      return `${segundos} segundos`;
    } else {
      const minutos = Math.floor(segundos / 60);
      const segsRestantes = segundos % 60;
      if (segsRestantes === 0) {
        return `${minutos} minuto${minutos > 1 ? 's' : ''}`;
      }
      return `${minutos} min ${segsRestantes} seg`;
    }
  }
}