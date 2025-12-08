import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardsPalabras } from "../../components/cards-palabras/cards-palabras";
import { PalabraData } from '../../interfaces/PalabraData';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { StudentActivityService } from '../../services/actividades/student-activity.service';
import { NavigationService } from '../../services/navigation/navigation-service';
import { TeacherActivityService } from "../../services/actividades/CRUD ActivityTeacher/teacher-activity.service";
import { LoadingScreenOverlay } from '../../shared/loading-screen-overlay/loading-screen-overlay';

@Component({
  selector: 'app-galeria-palabras',
  standalone: true,
  imports: [CardsPalabras, CommonModule, RouterModule, FloatingMessage, LoadingScreenOverlay],
  templateUrl: './galeria-palabras.html',
  styleUrls: ['./galeria-palabras.css']
})
export class GaleriaPalabras implements OnInit {
  palabras: PalabraData[] = [];
  modoEliminar: boolean = false;
  actividadesSeleccionadas: Set<string | number> = new Set();
  esProfesor: boolean = false;
  isLoading = false

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
    private studentActivityService: StudentActivityService,
    private nav: NavigationService,
    private teacherService: TeacherActivityService,
  ) { this.nav.currentView.set("Palabras") }

  ngOnInit(): void {
    this.detectarRol();
    this.cargarActividades();
  }

  detectarRol(): void {
    const rutaActual = this.router.url;
    this.esProfesor = rutaActual.includes('/teacher');
  }

  async cargarActividades(): Promise<void> {
    this.isLoading = true
    if (!this.esProfesor) {
      try {
        const result = await this.studentActivityService.getCognitiveActivities();
        if (result.success && result.activities) {
          console.log(result.activities)
          this.palabras = result.activities.map(act => ({
            id: act.id,
            titulo: act.titulo,
            colorFondo: this.obtenerColorAleatorio(),
            imagenUrl: act.thumbnail || '/crds.webp',
            enlace: `/cognitive-abilities/actividad/${act.id}`
          }));
          console.log(this.palabras)
        }
      } catch (error) {
        console.error('Error al cargar actividades de alumno:', error);
      }finally{
        this.isLoading = false
        return;
      }
    }

    try {
      const response = await this.teacherService.getMyActivities();

      if (response.success && response.activities) {
        this.palabras = response.activities.map(activity => ({
          id: activity.id,
          titulo: activity.titulo,
          imagenUrl: activity.thumbnail || '/crds.webp',
          colorFondo: this.obtenerColorAleatorio(),
          enlace: `/teacher/cognitive-abilities/actividad/${activity.id}`
        }));
      } else {
        this.palabras = [];
      }
    } catch (error) {
      console.error('Error al cargar actividades:', error);
      this.showNotice('Error', 'No se pudieron cargar las actividades.', 'error');
    }
    this.isLoading = false
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
  }

  toggleSeleccion(id: string | number): void {
    if (!this.modoEliminar || !this.esProfesor) return;

    if (this.actividadesSeleccionadas.has(id)) {
      this.actividadesSeleccionadas.delete(id);
    } else {
      this.actividadesSeleccionadas.add(id);
    }
  }

  isSeleccionada(id: string | number): boolean {
    return this.actividadesSeleccionadas.has(id);
  }

  eliminarSeleccionadas(): void {
    if (!this.esProfesor || this.actividadesSeleccionadas.size === 0) return;

    const cantidad = this.actividadesSeleccionadas.size;
    const mensaje = `¿Estás seguro de que deseas eliminar ${cantidad} actividad(es)?\nEsta acción eliminará permanentemente la actividad y sus contenidos.`;

    this.showNotice('Confirmar Eliminación', mensaje, 'info', 'Eliminar', 'Cancelar', async () => {

      const idsAEliminar = Array.from(this.actividadesSeleccionadas);
      let eliminadasCount = 0;
      let erroresCount = 0;
      for (const id of idsAEliminar) {
        const idString = String(id);
        const resultado = await this.teacherService.deleteActivity(idString);

        if (resultado.success) {
          eliminadasCount++;
        } else {
          console.error(`Error al eliminar actividad ${id}:`, resultado.message);
          erroresCount++;
        }
      }
      if (eliminadasCount > 0) {
        this.actividadesSeleccionadas.clear();
        this.modoEliminar = false;
        await this.cargarActividades();

        if (erroresCount === 0) {
          this.showNotice('Éxito', `${eliminadasCount} actividad(es) eliminada(s) correctamente.`, 'success');
        } else {
          this.showNotice('Aviso', `Se eliminaron ${eliminadasCount} actividades, pero ${erroresCount} fallaron.`, 'info');
        }
      } else {
        this.showNotice('Error', 'No se pudieron eliminar las actividades seleccionadas.', 'error');
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