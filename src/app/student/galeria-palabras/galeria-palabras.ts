import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";
import { PalabraData } from '../../interfaces/PalabraData';
import { PALABRAS_DATA_MOCK } from '../../data/palabra-data';
import { ActividadFormService } from '../../services/actividad.service';

@Component({
  selector: 'app-galeria-palabras',
  imports: [CardsPalabras, CommonModule, RouterModule],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})
export class GaleriaPalabras implements OnInit {
  palabras: PalabraData[] = [];
  modoEliminar: boolean = false;
  actividadesSeleccionadas: Set<number> = new Set();
  esProfesor: boolean = false; 

  constructor(
    private router: Router,
    private actividadService: ActividadFormService
  ) {}

  ngOnInit(): void {
    this.detectarRol();
    this.cargarActividades();
  }

  detectarRol(): void {
    const rutaActual = this.router.url;
    this.esProfesor = rutaActual.includes('/teacher');
    console.log('Es profesor:', this.esProfesor);
  }

  cargarActividades(): void {
    const actividadesGuardadas = this.actividadService.getAllActividades();
    
    if (actividadesGuardadas.length > 0) {
      const actividadesConvertidas: PalabraData[] = actividadesGuardadas.map((act: any) => ({
        id: act.id,
        titulo: act.titulo,
        colorFondo: this.obtenerColorAleatorio(),
        imagenUrl: act.palabrasCompletas?.[0]?.imagenUrl || '/crds.webp',
        enlace: `/student/cognitive-abilities/actividad/${act.id}`
      }));

      this.palabras = [...actividadesConvertidas, ...PALABRAS_DATA_MOCK];
    } else {
      this.palabras = PALABRAS_DATA_MOCK;
    }
    
    console.log("Actividades cargadas:", this.palabras.length);
  }

  irACrearActividad(): void {
    if (this.esProfesor) {
      this.router.navigate(['/teacher/crear-actividad']);
    }
  }

  toggleModoEliminar(): void {
    if (!this.esProfesor) return;
    
    this.modoEliminar = !this.modoEliminar;
    
    if (!this.modoEliminar) {
      this.actividadesSeleccionadas.clear();
    }
    
    console.log("Modo eliminar:", this.modoEliminar);
  }

  toggleSeleccion(id: number): void {
    if (!this.modoEliminar || !this.esProfesor) return;

    if (this.actividadesSeleccionadas.has(id)) {
      this.actividadesSeleccionadas.delete(id);
    } else {
      this.actividadesSeleccionadas.add(id);
    }
  }

  isSeleccionada(id: number): boolean {
    return this.actividadesSeleccionadas.has(id);
  }

  eliminarSeleccionadas(): void {
    if (!this.esProfesor || this.actividadesSeleccionadas.size === 0) {
      return;
    }

    const cantidad = this.actividadesSeleccionadas.size;
    const confirmacion = confirm(
      `¿Estás seguro de que deseas eliminar ${cantidad} actividad(es)?\n\n` +
      `Esta acción no se puede deshacer.`
    );

    if (!confirmacion) return;

    let eliminadas = 0;
    this.actividadesSeleccionadas.forEach(id => {
      if (this.actividadService.deleteActividad(id)) {
        eliminadas++;
      }
    });

    if (eliminadas > 0) {
      alert(`${eliminadas} actividad(es) eliminada(s) exitosamente`);
      this.actividadesSeleccionadas.clear();
      this.modoEliminar = false;
      this.cargarActividades();
    } else {
      alert('Error al eliminar las actividades');
    }
  }

  private obtenerColorAleatorio(): string {
    const colores = ['#BDE0FE', '#F78C8C', '#D4BFFF', '#FEF9C3', '#D9F7C4', '#C3D4FE'];
    return colores[Math.floor(Math.random() * colores.length)];
  }
}