import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActividadFormService, PalabraCompleta } from '../../services/actividad.service';
import { ActividadNavigationService } from '../../services/actividad.navegation.service';

@Component({
  selector: 'app-actividad-palabras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad-palabras.html',
  styleUrl: './actividad-palabras.css'
})
export class ActividadPalabras implements OnInit {
  palabras: PalabraCompleta[] = [];
  palabraActualIndex: number = 0;
  progreso: number = 0;
  actividadId: number | null = null;
  tituloActividad: string = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private actividadService: ActividadFormService,
    public navigationService: ActividadNavigationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.actividadId = parseInt(id);
      this.cargarActividad(this.actividadId);
    }
  }

  cargarActividad(id: number): void {
    const actividad = this.actividadService.getActividadById(id);
    
    if (actividad && actividad.palabrasCompletas) {
      this.palabras = actividad.palabrasCompletas;
      this.tituloActividad = actividad.titulo;
      this.calcularProgreso();
      console.log('Actividad cargada:', actividad);
    } else {
      console.error('Actividad no encontrada o sin palabras');
      alert('No se pudo cargar la actividad');
      this.regresar();
    }
  }

  get palabraActual(): PalabraCompleta | null {
    return this.palabras[this.palabraActualIndex] || null;
  }

  anteriorPalabra(): void {
    if (this.navigationService.puedeIrAnterior(this.palabraActualIndex)) {
      this.palabraActualIndex--;
      this.calcularProgreso();
    }
  }

  siguientePalabra(): void {
    if (this.navigationService.puedeirSiguiente(this.palabraActualIndex, this.palabras.length)) {
      this.palabraActualIndex++;
      this.calcularProgreso();
    }
  }

  calcularProgreso(): void {
    this.progreso = this.navigationService.calcularProgreso(
      this.palabraActualIndex, 
      this.palabras.length
    );
  }

  obtenerColorSilaba(index: number): string {
    return this.navigationService.obtenerColorSilaba(index);
  }

  obtenerColorFonema(index: number): string {
    return this.navigationService.obtenerColorFonema(index);
  }

  puedeIrAnterior(): boolean {
    return this.navigationService.puedeIrAnterior(this.palabraActualIndex);
  }

  puedeirSiguiente(): boolean {
    return this.navigationService.puedeirSiguiente(this.palabraActualIndex, this.palabras.length);
  }

  regresar(): void {
    this.location.back();
  }
}