import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";
import { PalabraData } from '../../interfaces/PalabraData';
import { PALABRAS_DATA_MOCK } from '../../data/palabra-data';

@Component({
  selector: 'app-galeria-palabras',
  imports: [CardsPalabras, CommonModule, RouterModule],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})
export class GaleriaPalabras implements OnInit {
  palabras: PalabraData[] = [];
  modoEliminar: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    const actividadesGuardadas = localStorage.getItem('actividades_cognitivas');
    
    if (actividadesGuardadas) {
      const actividades = JSON.parse(actividadesGuardadas);
    
      const actividadesConvertidas: PalabraData[] = actividades.map((act: any) => ({
        id: act.id,
        titulo: act.titulo,
        colorFondo: this.obtenerColorAleatorio(),
        imagenUrl: act.imagenPrincipal || '/crds.webp',
        enlace: `/student/cognitive-abilities/actividad/${act.id}`
      }));

      this.palabras = [...actividadesConvertidas, ...PALABRAS_DATA_MOCK];
    } else {
      this.palabras = PALABRAS_DATA_MOCK;
    }
    
    console.log("Actividades cargadas:", this.palabras.length);
  }

  irACrearActividad(): void {
    const rutaActual = this.router.url;
    
    if (rutaActual.includes('/teacher')) {
      this.router.navigate(['/teacher/crear-actividad']);
    } else {
      alert('Solo los profesores pueden crear actividades');
    }
  }

  toggleModoEliminar(): void {
    this.modoEliminar = !this.modoEliminar;
    console.log("Modo eliminar:", this.modoEliminar);
  }

  eliminarActividad(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      const actividadesGuardadas = localStorage.getItem('actividades_cognitivas');
      
      if (actividadesGuardadas) {
        const actividades = JSON.parse(actividadesGuardadas);
        const actividadesFiltradas = actividades.filter((act: any) => act.id !== id);
        localStorage.setItem('actividades_cognitivas', JSON.stringify(actividadesFiltradas));
      }

      this.palabras = this.palabras.filter(p => p.id !== id);
      console.log("Actividad eliminada:", id);
    }
  }

  private obtenerColorAleatorio(): string {
    const colores = ['#BDE0FE', '#F78C8C', '#D4BFFF', '#FEF9C3', '#D9F7C4', '#C3D4FE'];
    return colores[Math.floor(Math.random() * colores.length)];
  }
}