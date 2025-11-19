import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";
import { PalabraData } from '../../interfaces/PalabraData';
import { PALABRAS_DATA_MOCK } from '../../data/palabra-data';
import { ActividadFormService } from '../../services/actividad.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-galeria-palabras',
  imports: [CardsPalabras, CommonModule, RouterModule, FloatingMessage],
  templateUrl: './galeria-palabras.html',
  styleUrls: ['./galeria-palabras.css']
})
export class GaleriaPalabras implements OnInit {
  palabras: PalabraData[] = [];
  modoEliminar: boolean = false;
  actividadesSeleccionadas: Set<number> = new Set();
  esProfesor: boolean = false; 

  // Floating message
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
    console.log('👤 Es profesor:', this.esProfesor);
  }

  cargarActividades(): void {
    const actividadesGuardadas = this.actividadService.getAllActividades();
    console.log('Actividades guardadas en localStorage:', actividadesGuardadas);
    
    if (actividadesGuardadas.length > 0) {
      const actividadesConvertidas: PalabraData[] = actividadesGuardadas.map((act: any) => {
        // Asegurarse de que el ID sea un número entero
        const idLimpio = Math.floor(Number(act.id));
        console.log(`Convirtiendo actividad: "${act.titulo}" con ID: ${idLimpio}`);
        
        return {
          id: idLimpio,
          titulo: act.titulo,
          colorFondo: this.obtenerColorAleatorio(),
          imagenUrl: act.imagenPortada || act.palabrasCompletas?.[0]?.imagenUrl || '/crds.webp',
          enlace: `/cognitive-abilities/actividad/${idLimpio}`
        };
      });

      this.palabras = [...actividadesConvertidas, ...PALABRAS_DATA_MOCK];
      console.log('Total palabras cargadas:', this.palabras.length);
      console.log('IDs finales:', this.palabras.map(p => ({ id: p.id, titulo: p.titulo })));
    } else {
      console.log('No hay actividades guardadas, usando MOCK');
      this.palabras = PALABRAS_DATA_MOCK;
    }
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
      console.log('Deseleccionada actividad:', id);
    } else {
      this.actividadesSeleccionadas.add(id);
      console.log('Seleccionada actividad:', id);
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
    const mensaje = `¿Estás seguro de que deseas eliminar ${cantidad} actividad(es)?\n\n` +
                    `Esta acción no se puede deshacer.`;

    this.showNotice('Confirmar', mensaje, 'info', 'Eliminar', 'Cancelar', () => {
      let eliminadas = 0;
      this.actividadesSeleccionadas.forEach(id => {
        if (this.actividadService.deleteActividad(id)) {
          eliminadas++;
        }
      });

      if (eliminadas > 0) {
        this.actividadesSeleccionadas.clear();
        this.modoEliminar = false;
        this.cargarActividades();
        console.log('Actividades eliminadas exitosamente:', eliminadas);
        this.showNotice('Éxito', `${eliminadas} actividad(es) eliminada(s) exitosamente`, 'success', 'Aceptar');
      } else {
        console.error('Error al eliminar actividades');
        this.showNotice('Error', 'Error al eliminar las actividades', 'error', 'Aceptar');
      }
    });
  }

  private obtenerColorAleatorio(): string {
    const colores = ['#BDE0FE', '#F78C8C', '#D4BFFF', '#FEF9C3', '#D9F7C4', '#C3D4FE'];
    return colores[Math.floor(Math.random() * colores.length)];
  }

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