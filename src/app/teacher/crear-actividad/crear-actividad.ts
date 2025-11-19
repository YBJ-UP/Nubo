import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { 
  ActividadFormService, 
  PalabraCompleta
} from '../../services/actividad.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatingMessage],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit {
  titulo = '';
  imagenPortada = 'perfil.jpg'; 
  palabrasCompletas: PalabraCompleta[] = [];
  mostrarInstrucciones = false;
  // Floating message state
  notice = {
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'error',
    primaryLabel: 'Aceptar',
    secondaryLabel: undefined as string | undefined
  };
  private _primaryCb?: () => void;
  private _secondaryCb?: () => void;
  
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
      this.showNotice('Error', resultado.mensaje, 'error', 'Aceptar');
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
      this.showNotice('Error', resultado.mensaje, 'error', 'Aceptar');
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
      this.showNotice('Error', 'Debe haber al menos una sílaba.', 'error', 'Aceptar');
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
      this.showNotice('Error', 'Debe haber al menos un fonema.', 'error', 'Aceptar');
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
      this.showNotice('Error', 'Debe haber al menos una palabra en la actividad.', 'error', 'Aceptar');
      return;
    }
    this.showNotice('Confirmar', '¿Estás seguro de que deseas eliminar esta palabra?', 'info', 'Eliminar', 'Cancelar', () => {
      this.palabrasCompletas.splice(index, 1);
    });
  }

  async guardarActividad(): Promise<void> {
    const resultado = await this.actividadFormService.guardarActividadCompleta(
      this.titulo,
      this.imagenPortada, 
      this.palabrasCompletas
    );

    if (resultado.exito) {
      this.showNotice('Éxito', resultado.mensaje, 'success', 'Aceptar', undefined, () => {
        this.router.navigate(['teacher', 'cognitive-abilities']);
      });
    } else {
      this.showNotice('Error', resultado.mensaje, 'error', 'Aceptar');
    }
  }

  regresar(): void {
    if (this.actividadFormService.hayaCambiosSinGuardar(
      this.titulo,
      this.imagenPortada, 
      this.palabrasCompletas
    )) {
      this.showNotice('Confirmar', '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.', 'info', 'Sí', 'No', () => this.location.back());
    } else {
      this.location.back();
    }
  }

  // Helpers for floating notice
  private showNotice(
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
    primaryLabel = 'Aceptar',
    secondaryLabel?: string,
    primaryCb?: () => void,
    secondaryCb?: () => void
  ) {
    this.notice.title = title;
    this.notice.message = message;
    this.notice.type = type;
    this.notice.primaryLabel = primaryLabel;
    this.notice.secondaryLabel = secondaryLabel;
    this._primaryCb = primaryCb;
    this._secondaryCb = secondaryCb;
    this.notice.visible = true;
  }

  onNoticePrimary(): void {
    if (this._primaryCb) this._primaryCb();
    this.notice.visible = false;
  }

  onNoticeSecondary(): void {
    if (this._secondaryCb) this._secondaryCb();
    this.notice.visible = false;
  }
}