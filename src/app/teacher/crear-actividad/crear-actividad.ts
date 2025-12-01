import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
// Services
import { ActividadFormService, PalabraCompleta } from '../../services/actividad.service';
import { ActivityValidationService } from '../../services/activity-validation.service';
import { ActivityFormStateService } from '../../services/activity-form-state.service';
import { ActivitySyncService } from '../../services/activity-sync.service';
import { NotificationService } from '../../services/notification.service';
import { TeacherAuthService } from '../../services/teacher-auth.service';
// Components
import { FloatingMessage } from '../../shared/floating-message/floating-message';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatingMessage],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  titulo = '';
  imagenPortada = 'perfil.jpg';
  palabrasCompletas: PalabraCompleta[] = [];
  mostrarInstrucciones = false;
  
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
    private router: Router,
    private actividadFormService: ActividadFormService,
    private validationService: ActivityValidationService,
    private stateService: ActivityFormStateService,
    private syncService: ActivitySyncService,
    private notificationService: NotificationService,
    private authService: TeacherAuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeForm();
    this.subscribeToNotifications();
    this.subscribeToState();
  }

  ngOnDestroy(): void {
    this.stateService.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.error(
        'Error',
        'Debes iniciar sesión para crear actividades',
        () => this.router.navigate(['/login'])
      );
    }
  }

  private initializeForm(): void {
    const nuevaPalabra = this.actividadFormService.crearPalabraCompleta();
    this.palabrasCompletas.push(nuevaPalabra);
    this.stateService.updatePalabrasCompletas([nuevaPalabra]);
  }

  private subscribeToNotifications(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        if (state.visible && state.config) {
          this.showNotice(
            state.config.title,
            state.config.message,
            state.config.type,
            state.config.primaryLabel,
            state.config.secondaryLabel,
            state.config.primaryAction,
            state.config.secondaryAction
          );
        } else {
          this.notice.visible = false;
        }
      });
  }

  private subscribeToState(): void {
    this.stateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.titulo = state.titulo;
        this.imagenPortada = state.imagenPortada;
        this.palabrasCompletas = state.palabrasCompletas;
        this.mostrarInstrucciones = state.mostrarInstrucciones;
      });
  }

  toggleInstrucciones(): void {
    this.stateService.toggleInstrucciones();
  }

  triggerPortadaInput(): void {
    const input = document.getElementById('portadaInput') as HTMLInputElement;
    input?.click();
  }

  async onPortadaSeleccionada(event: Event): Promise<void> {
    const resultado = await this.actividadFormService.procesarImagenSeleccionada(event);
    
    if (resultado.exito && resultado.url) {
      this.imagenPortada = resultado.url;
      this.stateService.updateImagenPortada(resultado.url);
    } else {
      this.notificationService.error('Error', resultado.mensaje);
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
      this.stateService.updatePalabraAt(palabraIndex, this.palabrasCompletas[palabraIndex]);
    } else {
      this.notificationService.error('Error', resultado.mensaje);
    }
  }

    agregarSilaba(palabraIndex: number): void {
    this.palabrasCompletas[palabraIndex].silabas.push(
      this.actividadFormService.crearPalabraVacia()
    );
    this.stateService.updatePalabraAt(palabraIndex, this.palabrasCompletas[palabraIndex]);
  }

  eliminarSilaba(palabraIndex: number, silabaId: number): void {
    const silabas = this.palabrasCompletas[palabraIndex].silabas;
    
    if (!this.actividadFormService.puedeEliminarItem(silabas.length)) {
      this.notificationService.error('Error', 'Debe haber al menos una sílaba.');
      return;
    }

    this.palabrasCompletas[palabraIndex].silabas = silabas.filter(s => s.id !== silabaId);
    this.stateService.updatePalabraAt(palabraIndex, this.palabrasCompletas[palabraIndex]);
  }

  agregarFonema(palabraIndex: number): void {
    this.palabrasCompletas[palabraIndex].fonemas.push(
      this.actividadFormService.crearFonemaVacio()
    );
    this.stateService.updatePalabraAt(palabraIndex, this.palabrasCompletas[palabraIndex]);
  }

  eliminarFonema(palabraIndex: number, fonemaId: number): void {
    const fonemas = this.palabrasCompletas[palabraIndex].fonemas;
    
    if (!this.actividadFormService.puedeEliminarItem(fonemas.length)) {
      this.notificationService.error('Error', 'Debe haber al menos un fonema.');
      return;
    }

    this.palabrasCompletas[palabraIndex].fonemas = fonemas.filter(f => f.id !== fonemaId);
    this.stateService.updatePalabraAt(palabraIndex, this.palabrasCompletas[palabraIndex]);
  }

  agregarNuevaPalabra(): void {
    const nuevaPalabra = this.actividadFormService.crearPalabraCompleta();
    this.palabrasCompletas.push(nuevaPalabra);
    this.stateService.addPalabraCompleta(nuevaPalabra);
    
    setTimeout(() => this.scrollToBottom(), 100);
  }

  eliminarPalabraCompleta(index: number): void {
    if (this.palabrasCompletas.length === 1) {
      this.notificationService.error(
        'Error',
        'Debe haber al menos una palabra en la actividad.'
      );
      return;
    }

    this.notificationService.confirmDeleteWord(index + 1, () => {
      this.palabrasCompletas.splice(index, 1);
      this.stateService.removePalabraCompleta(index);
    });
  }

  async guardarActividad(): Promise<void> {
    const validation = this.validationService.validateActivityForm(
      this.titulo,
      this.imagenPortada,
      this.palabrasCompletas
    );

    if (!validation.isValid) {
      this.notificationService.showValidationErrors(validation.errors);
      return;
    }

    this.stateService.setSubmitting(true);

    try {
      const result = await this.syncService.saveActivity(
        this.titulo,
        this.imagenPortada,
        this.palabrasCompletas
      );

      this.handleSaveResult(result);

    } catch (error) {
      console.error('Error al guardar actividad:', error);
      this.handleSaveError();
    } finally {
      this.stateService.setSubmitting(false);
    }
  }

  private handleSaveResult(result: any): void {
    if (result.success && result.syncedToApi) {
      this.notificationService.activityCreatedSuccess(
        this.titulo,
        () => this.navigateToActivities()
      );
    } else if (result.success && result.savedLocally) {
      this.notificationService.activitySavedLocallyWarning(
        () => this.navigateToActivities()
      );
    } else {
      this.notificationService.error('Error', result.message);
    }
  }

  private handleSaveError(): void {
    this.notificationService.confirmSaveLocalOnly(
      async () => {
        const result = await this.syncService.saveLocalOnly(
          this.titulo,
          this.imagenPortada,
          this.palabrasCompletas
        );

        if (result.success) {
          this.notificationService.activitySavedLocallyWarning(
            () => this.navigateToActivities()
          );
        } else {
          this.notificationService.error('Error', result.message);
        }
      }
    );
  }

  regresar(): void {
    const hasChanges = this.validationService.hasUnsavedChanges(
      this.titulo,
      this.imagenPortada,
      this.palabrasCompletas
    );

    if (hasChanges) {
      this.notificationService.confirmDiscardChanges(() => this.location.back());
    } else {
      this.location.back();
    }
  }

  private navigateToActivities(): void {
    this.router.navigate(['teacher', 'cognitive-abilities']);
  }
  
  private scrollToBottom(): void {
    const container = document.querySelector('.main-container');
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
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
  ): void {
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