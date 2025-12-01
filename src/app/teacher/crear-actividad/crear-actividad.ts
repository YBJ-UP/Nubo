import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { CrearActividadPresenter } from '../../services/presenter/crear-actividad.presenter';
import { ActivityFormStateService } from '../../services/activity-form-state.service';
import { NotificationService } from '../../services/notification.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { PalabraCompleta } from '../../services/actividad.service';

@Component({
  selector: 'app-crear-actividad',
  standalone: true,
  imports: [CommonModule, FormsModule, FloatingMessage],
  providers: [CrearActividadPresenter],
  templateUrl: './crear-actividad.html',
  styleUrls: ['./crear-actividad.css']
})
export class CrearActividadComponent implements OnInit, OnDestroy {
  titulo = '';
  imagenPortada = 'perfil.jpg';
  palabrasCompletas: PalabraCompleta[] = [];
  mostrarInstrucciones = false;
  
  notice = {
    visible: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'error' | 'warning',
    primaryLabel: 'Aceptar',
    secondaryLabel: undefined as string | undefined
  };
  
  private _primaryCb?: () => void;
  private _secondaryCb?: () => void;

  constructor(
    private presenter: CrearActividadPresenter,
    private stateService: ActivityFormStateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.presenter.initialize();
    this.subscribeToState();
    this.subscribeToNotifications();
  }

  ngOnDestroy(): void {
    this.presenter.cleanup();
  }

  private subscribeToState(): void {
    this.stateService.state$
      .pipe(takeUntil(this.presenter.getDestroySubject()))
      .subscribe(state => {
        this.titulo = state.titulo;
        this.imagenPortada = state.imagenPortada;
        this.palabrasCompletas = state.palabrasCompletas;
        this.mostrarInstrucciones = state.mostrarInstrucciones;
      });
  }

  private subscribeToNotifications(): void {
    this.notificationService.notification$
      .pipe(takeUntil(this.presenter.getDestroySubject()))
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

  toggleInstrucciones(): void {
    this.presenter.toggleInstructions();
  }

  triggerPortadaInput(): void {
    this.presenter.triggerPortadaUpload();
  }

  async onPortadaSeleccionada(event: Event): Promise<void> {
    await this.presenter.handlePortadaUpload(event);
  }

  triggerImagenInput(index: number): void {
    this.presenter.triggerWordImageUpload(index);
  }

  async onImagenSeleccionada(event: Event, palabraIndex: number): Promise<void> {
    await this.presenter.handleWordImageUpload(event, palabraIndex, this.palabrasCompletas);
  }

  agregarSilaba(palabraIndex: number): void {
    this.presenter.addSyllable(palabraIndex, this.palabrasCompletas);
  }

  eliminarSilaba(palabraIndex: number, silabaId: number): void {
    this.presenter.removeSyllable(palabraIndex, silabaId, this.palabrasCompletas);
  }

  agregarFonema(palabraIndex: number): void {
    this.presenter.addPhoneme(palabraIndex, this.palabrasCompletas);
  }

  eliminarFonema(palabraIndex: number, fonemaId: number): void {
    this.presenter.removePhoneme(palabraIndex, fonemaId, this.palabrasCompletas);
  }

  agregarNuevaPalabra(): void {
    this.presenter.addNewWord();
  }

  eliminarPalabraCompleta(index: number): void {
    this.presenter.removeWord(index, this.palabrasCompletas);
  }

  async guardarActividad(): Promise<void> {
    await this.presenter.saveActivity(this.titulo, this.imagenPortada, this.palabrasCompletas);
  }

  regresar(): void {
    this.presenter.goBack(this.titulo, this.imagenPortada, this.palabrasCompletas);
  }

  private showNotice(
    title: string,
    message: string,
    type: 'info' | 'success' | 'error' | 'warning' = 'info',
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