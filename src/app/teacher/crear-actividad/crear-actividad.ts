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
import { TeacherActivityService } from '../../services/teacher-activity.service';
import { TeacherAuthService } from '../../services/teacher-auth.service';

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
  
  // Estado de carga para el envío a la API
  isSubmitting = false;

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
    private router: Router,
    private teacherActivityService: TeacherActivityService,
    private teacherAuthService: TeacherAuthService
  ) {}

  ngOnInit(): void {
    if (!this.teacherAuthService.isAuthenticated()) {
      this.showNotice(
        'Error',
        'Debes iniciar sesión para crear actividades',
        'error',
        'Ir al login',
        undefined,
        () => this.router.navigate(['/login'])
      );
      return;
    }

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
    const validacionLocal = await this.actividadFormService.guardarActividadCompleta(
      this.titulo,
      this.imagenPortada,
      this.palabrasCompletas
    );

    if (!validacionLocal.exito) {
      this.showNotice('Error', validacionLocal.mensaje, 'error', 'Aceptar');
      return;
    }

    this.isSubmitting = true;

    try {
      const contentForApi = this.teacherActivityService.convertContentToApiFormat(
        this.palabrasCompletas
      );

      const result = await this.teacherActivityService.createCognitiveActivity({
        title: this.titulo,
        thumbnail: this.imagenPortada,
        isPublic: true,
        content: contentForApi
      });

      if (result.success && result.activity) {
        console.log('Actividad guardada en API:', result.activity);
        
        const actividadLocal = this.teacherActivityService.convertToLocalFormat(result.activity);
        const actividades = this.actividadFormService.getAllActividades();
        actividades.push(actividadLocal);
        localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));

        this.showNotice(
          'Éxito',
          '¡Actividad creada exitosamente!\n\nLa actividad está disponible para tus estudiantes.',
          'success',
          'Ver actividades',
          undefined,
          () => this.router.navigate(['teacher', 'cognitive-abilities'])
        );
      } else {
        this.showNotice(
          'Advertencia',
          `No se pudo conectar con el servidor:\n\n${result.message}\n\n¿Deseas guardar la actividad solo localmente?`,
          'info',
          'Sí, guardar local',
          'Cancelar',
          () => {
            this.guardarSoloLocal();
          }
        );
      }
    } catch (error) {
      console.error('Error al guardar actividad:', error);
      
      this.showNotice(
        'Error de Conexión',
        'No se pudo conectar con el servidor.\n\n¿Deseas guardar la actividad solo localmente? Podrás sincronizarla más tarde.',
        'error',
        'Sí, guardar local',
        'Cancelar',
        () => {
          this.guardarSoloLocal();
        }
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private guardarSoloLocal(): void {
    const actividades = this.actividadFormService.getAllActividades();
    
    const nuevaActividad = {
      id: Date.now(), 
      titulo: this.titulo,
      imagenPortada: this.imagenPortada,
      palabrasCompletas: this.palabrasCompletas.map(p => ({
        ...p,
        silabas: p.silabas.filter(s => s.texto.trim()),
        fonemas: p.fonemas.filter(f => f.texto.trim())
      })),
      fechaCreacion: new Date(),
      sincronizado: false 
    };
    
    actividades.push(nuevaActividad);
    localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));
    
    this.showNotice(
      'Guardado Local',
      'La actividad se guardó localmente. Se sincronizará cuando el servidor esté disponible.',
      'success',
      'Aceptar',
      undefined,
      () => this.router.navigate(['teacher', 'cognitive-abilities'])
    );
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