import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { 
  ActividadFormService, 
  Palabra, 
  Fonema 
} from '../../services/actividad.service';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit {
  @ViewChild('imagenPrincipalInput') imagenPrincipalInput!: ElementRef<HTMLInputElement>;

  titulo = '';
  imagenPrincipalUrl = 'perfil.jpg';
  palabras: Palabra[] = [];
  fonemas: Fonema[] = [];
  mostrarInstrucciones = false;
  
  constructor(
    private location: Location,
    private actividadFormService: ActividadFormService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.palabras = this.actividadFormService.inicializarPalabras(3);
    this.fonemas = this.actividadFormService.inicializarFonemas(4);
  }

  toggleInstrucciones(): void {
    this.mostrarInstrucciones = !this.mostrarInstrucciones;
  }

  triggerImagenPrincipal(): void {
    this.imagenPrincipalInput?.nativeElement.click();
  }

  async onImagenPrincipalSeleccionada(event: Event): Promise<void> {
    const resultado = await this.actividadFormService.procesarImagenSeleccionada(event);
    if (resultado.exito) {
      this.imagenPrincipalUrl = resultado.url!;
    } else {
      alert(resultado.mensaje);
    }
  }

  agregarPalabra(): void {
    this.palabras.push(this.actividadFormService.crearPalabraVacia());
  }

  eliminarPalabra(id: number): void {
    if (!this.actividadFormService.puedeEliminarItem(this.palabras.length)) {
      alert('Debe haber al menos una sílaba.');
      return;
    }
    this.palabras = this.palabras.filter(p => p.id !== id);
  }

  agregarFonema(): void {
    this.fonemas.push(this.actividadFormService.crearFonemaVacio());
  }

  eliminarFonema(id: number): void {
    if (!this.actividadFormService.puedeEliminarItem(this.fonemas.length)) {
      alert('Debe haber al menos un fonema.');
      return;
    }
    this.fonemas = this.fonemas.filter(f => f.id !== id);
  }

  agregarNuevaPalabra(): void {
    if (confirm('¿Deseas agregar una nueva palabra? Esto creará nuevos campos vacíos.')) {
      this.agregarPalabra();
      this.agregarFonema();
    }
  }

  async guardarActividad(): Promise<void> {
    const resultado = await this.actividadFormService.guardarActividadCompleta(
      this.titulo,
      this.palabras,
      this.fonemas,
      this.imagenPrincipalUrl
    );

    alert(resultado.mensaje);
    if (resultado.exito) {
      this.location.back();
    }
  }

  regresar(): void {
    if (this.actividadFormService.hayaCambiosSinGuardar(
      this.titulo,
      this.palabras,
      this.fonemas,
      this.imagenPrincipalUrl
    )) {
      if (confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }
}