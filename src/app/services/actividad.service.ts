import { Injectable } from '@angular/core';
import { ActividadCognitiva } from '../interfaces/ActividadCognitiva';

@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private readonly STORAGE_KEY = 'actividades_cognitivas';

  constructor() { }

  crearActividad(actividad: ActividadCognitiva): boolean {
    try {
      const actividades = this.obtenerActividades();
      actividades.push(actividad);
      this.guardarEnStorage(actividades);
      return true;
    } catch (error) {
      console.error('Error al crear actividad:', error);
      return false;
    }
  }

  obtenerActividades(): ActividadCognitiva[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      return [];
    }
  }

  obtenerActividadPorId(id: number): ActividadCognitiva | undefined {
    const actividades = this.obtenerActividades();
    return actividades.find(a => a.id === id);
  }

  actualizarActividad(id: number, actividadActualizada: ActividadCognitiva): boolean {
    try {
      const actividades = this.obtenerActividades();
      const index = actividades.findIndex(a => a.id === id);
      
      if (index !== -1) {
        actividades[index] = actividadActualizada;
        this.guardarEnStorage(actividades);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      return false;
    }
  }

  eliminarActividad(id: number): boolean {
    try {
      const actividades = this.obtenerActividades();
      const actividadesFiltradas = actividades.filter(a => a.id !== id);
      this.guardarEnStorage(actividadesFiltradas);
      return true;
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      return false;
    }
  }

  private guardarEnStorage(actividades: ActividadCognitiva[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(actividades));
  }

  limpiarActividades(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}