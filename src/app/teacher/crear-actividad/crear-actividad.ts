import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { 
  ActividadFormService, 
  PalabraCompleta
} from '../../services/actividad.service';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit {
  titulo = '';
  imagenPortada = 'perfil.jpg'; 
  palabrasCompletas: PalabraCompleta[] = [];
  mostrarInstrucciones = false;
  
  constructor(
    private location: Location,
    private actividadFormService: ActividadFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.palabrasCompletas.push(this.actividadFormService.crearPalabraCompleta());
  }

  toggleInstrucciones(): void {
    this.mostrarInstrucciones = !this.mostrarInstrucciones;
  }

  triggerPortadaInput(): void {
    const input = document.getElementById('portadaInput') as HTMLInputElement;
    input?.click();
  }

  async onPortadaSeleccionada(event: Event): Promise<void> {
    const resultado = await this.actividadFormService.procesarImagenSeleccionada(event);
    if (resultado.exito && resultado.url) {
      this.imagenPortada = resultado.url;
    } else {
      alert(resultado.mensaje);
    }
  }

  triggerImagenInput(index: number): void {
    const input = document.getElementById(`imagenInput-${index}`) as HTMLInputElement;
    input?.click();
  }

  async onImagenSeleccionada(event: Event, palabraIndex: number): Promise<void> {
    const resultado = await this.actividadFormService.procesarImagenSeleccionada(event);
    if (resultado.exito && resultado.url) {
      this.palabrasCompletas[palabraIndex].imagenUrl = resultado.url;
    } else {
      alert(resultado.mensaje);
    }
  }

  agregarSilaba(palabraIndex: number): void {
    this.palabrasCompletas[palabraIndex].silabas.push(
      this.actividadFormService.crearPalabraVacia()
    );
  }

  eliminarSilaba(palabraIndex: number, silabaId: number): void {
    const silabas = this.palabrasCompletas[palabraIndex].silabas;
    if (!this.actividadFormService.puedeEliminarItem(silabas.length)) {
      alert('Debe haber al menos una sílaba.');
      return;
    }
    this.palabrasCompletas[palabraIndex].silabas = silabas.filter(s => s.id !== silabaId);
  }

  agregarFonema(palabraIndex: number): void {
    this.palabrasCompletas[palabraIndex].fonemas.push(
      this.actividadFormService.crearFonemaVacio()
    );
  }

  eliminarFonema(palabraIndex: number, fonemaId: number): void {
    const fonemas = this.palabrasCompletas[palabraIndex].fonemas;
    if (!this.actividadFormService.puedeEliminarItem(fonemas.length)) {
      alert('Debe haber al menos un fonema.');
      return;
    }
    this.palabrasCompletas[palabraIndex].fonemas = fonemas.filter(f => f.id !== fonemaId);
  }

  agregarNuevaPalabra(): void {
    this.palabrasCompletas.push(this.actividadFormService.crearPalabraCompleta());
    
    setTimeout(() => {
      const container = document.querySelector('.main-container');
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  eliminarPalabraCompleta(index: number): void {
    if (this.palabrasCompletas.length === 1) {
      alert('Debe haber al menos una palabra en la actividad.');
      return;
    }

    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta palabra?');
    if (confirmacion) {
      this.palabrasCompletas.splice(index, 1);
    }
  }

  async guardarActividad(): Promise<void> {
    const resultado = await this.actividadFormService.guardarActividadCompleta(
      this.titulo,
      this.imagenPortada, 
      this.palabrasCompletas
    );

    alert(resultado.mensaje);
    if (resultado.exito) {
      // Navegar explícitamente a la lista de actividades cognitivas del teacher
      this.router.navigate(['teacher', 'cognitive-abilities']);
    }
  }

  regresar(): void {
    if (this.actividadFormService.hayaCambiosSinGuardar(
      this.titulo,
      this.imagenPortada, 
      this.palabrasCompletas
    )) {
      if (confirm('¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.')) {
        this.location.back();
      }
    } else {
      this.location.back();
    }
  }
}