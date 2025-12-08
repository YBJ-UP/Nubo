import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ActividadFormService } from '../../services/actividades/actividad.service';
import { PalabraCompleta } from '../../interfaces/actividad-completa';
import { ActividadNavigationService } from '../../services/actividades/actividad.navegation.service';
import { ProgressService, ProgressData } from '../../services/utilidades/progress.service';
import { AudioPlaybackService } from '../../services/audio/audio-playback.service';
import { ActividadStateService } from '../../services/actividades/actividad-state.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { StudentActivityService } from '../../services/actividades/student-activity.service';
import { NotificationService } from '../../services/utilidades/notification.service';
import { TextToSpeechService } from '../../services/utilidades/text-to-speech.service';

@Component({
  selector: 'app-actividad-palabras',
  standalone: true,
  imports: [CommonModule, FloatingMessage],
  templateUrl: './actividad-palabras.html',
  styleUrls: ['./actividad-palabras.css']
})
export class ActividadPalabras implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

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
  mainCardBgColor: string = '#FFFFFF';
  isLoading: boolean = true;

  get palabraActual(): PalabraCompleta | null {
    return this.stateService.getPalabraActual();
  }

  get progreso(): number {
    return this.stateService.getProgreso();
  }

  get progressData(): ProgressData | null {
    return this.stateService.getProgressData();
  }

  get isPlayingAudio(): boolean {
    return this.audioService.isPlaying();
  }

  get audioError(): string | null {
    return this.audioService.getError();
  }

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private actividadService: ActividadFormService,
    public navigationService: ActividadNavigationService,
    private progressService: ProgressService,
    private audioService: AudioPlaybackService,
    private stateService: ActividadStateService,
    private studentActivityService: StudentActivityService,
    public notificationService: NotificationService,
    private textToSpeechService: TextToSpeechService
  ) { }

  ngOnInit(): void {
    this.inicializarActividad();
    this.verificarSoporteAudio();
    this.notificationService.notification$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.notice.visible = state.visible;
        if (state.config) {
          this.notice.title = state.config.title;
          this.notice.message = state.config.message;
          this.notice.type = state.config.type as 'info' | 'success' | 'error';
          this.notice.primaryLabel = state.config.primaryLabel || 'Aceptar';
          this.notice.secondaryLabel = state.config.secondaryLabel;

          this._primaryCb = state.config.primaryAction;
          this._secondaryCb = state.config.secondaryAction;
        }
      });
  }

  ngOnDestroy(): void {
    this.audioService.limpiarEstado();
    this.stateService.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private async inicializarActividad(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const actividadId = id; // Mantener como string
      this.stateService.setActividadId(actividadId);
      await this.cargarActividad(actividadId);
    }
  }

  private verificarSoporteAudio(): void {
    if (!this.audioService.isSpeechSupported()) {
      console.warn('Web Speech API no está soportada en este navegador');
    }
  }

  private async cargarActividad(id: string | number): Promise<void> {
    this.isLoading = true;
    const idStr = String(id);

    try {
      let apiResult = await this.studentActivityService.getActivityById(idStr);

      if (apiResult.success && apiResult.activity) {
        const actividadLocal = this.studentActivityService.convertToLocalFormat(apiResult.activity);

        this.stateService.setPalabras(actividadLocal.palabrasCompletas);
        this.stateService.setTituloActividad(actividadLocal.titulo);
        this.actualizarProgreso();

        console.log('Actividad cargada desde API:', {
          titulo: actividadLocal.titulo,
          id: id
        });

        this.isLoading = false;
        return;
      }
    } catch (error) {
      console.warn('Error al intentar cargar desde API, intentando local...', error);
    }

    const actividad = this.actividadService.getActividadById(id);

    if (actividad && actividad.palabrasCompletas) {
      this.stateService.setPalabras(actividad.palabrasCompletas);
      this.stateService.setTituloActividad(actividad.titulo);
      this.actualizarProgreso();

      console.log('Actividad cargada desde localStorage:', {
        titulo: actividad.titulo,
        totalPalabras: actividad.palabrasCompletas.length,
        id: actividad.id
      });
    } else {
      console.error('Actividad no encontrada ni en API ni local');
      this.notificationService.error('Error', 'No se pudo cargar la actividad', () => this.regresar());
    }

    this.isLoading = false;
  }

  anteriorPalabra(): void {
    const currentIndex = this.stateService.getPalabraActualIndex();

    if (this.navigationService.puedeIrAnterior(currentIndex)) {
      this.audioService.detenerAudio();
      const nuevoIndex = this.navigationService.obtenerAnteriorIndice(currentIndex);
      this.stateService.setPalabraActualIndex(nuevoIndex);
      this.actualizarProgreso();
      console.log('Navegando a palabra anterior:', nuevoIndex + 1);
    }
  }

  siguientePalabra(): void {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();

    if (this.navigationService.puedeirSiguiente(currentIndex, totalPalabras)) {
      this.audioService.detenerAudio();
      const nuevoIndex = this.navigationService.obtenerSiguienteIndice(currentIndex, totalPalabras);
      this.stateService.setPalabraActualIndex(nuevoIndex);
      this.actualizarProgreso();
      console.log('Navegando a siguiente palabra:', nuevoIndex + 1);
    }
  }

  private actualizarProgreso(): void {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();

    const progreso = this.navigationService.calcularProgreso(currentIndex, totalPalabras);
    const progressData = this.progressService.obtenerDatosProgreso(currentIndex, totalPalabras);

    this.stateService.setProgreso(progreso);
    this.stateService.setProgressData(progressData);
    this.mainCardBgColor = this.navigationService.obtenerColorAleatorio();
  }

  async reproducirPalabraCompleta(): Promise<void> {
    if (!this.palabraActual) return;

    try {
      await this.audioService.reproducirPalabra(this.palabraActual.palabra);
    } catch (error) {
      console.error('Error al reproducir palabra completa:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la palabra');
      this.notificationService.error('Error de audio', msg);
    }
  }

  async reproducirSilaba(silaba: string): Promise<void> {
    try {
      await this.audioService.reproducirSilaba(silaba);
    } catch (error) {
      console.error('Error al reproducir sílaba:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la sílaba');
      this.notificationService.error('Error de audio', msg);
    }
  }

  async reproducirFonema(fonema: string): Promise<void> {
    try {
      await this.audioService.reproducirFonema(fonema);
    } catch (error) {
      console.error('Error al reproducir fonema:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir el fonema');
      this.notificationService.error('Error de audio', msg);
    }
  }

  async playWord(word: string): Promise<void> {
    try {
      const result = await this.textToSpeechService.speak(word);
      const audio = new Audio(result.audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error al reproducir audio de palabra:', error);
      this.notificationService.error('Error de audio', 'No se pudo reproducir la palabra');
    }
  }

  async reproducirSecuenciasyllables(): Promise<void> {
    if (!this.palabraActual) return;

    try {
      await this.audioService.reproducirSecuenciasyllables(this.palabraActual);
    } catch (error) {
      console.error('Error al reproducir secuencia de sílabas:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la secuencia de sílabas');
      this.notificationService.error('Error de audio', msg);
    }
  }

  async reproducirSecuenciaFonemas(): Promise<void> {
    if (!this.palabraActual) return;

    try {
      await this.audioService.reproducirSecuenciaFonemas(this.palabraActual);
    } catch (error) {
      console.error('Error al reproducir secuencia de fonemas:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la secuencia de fonemas');
      this.notificationService.error('Error de audio', msg);
    }
  }

  detenerAudio(): void {
    this.audioService.detenerAudio();
  }

  obtenerColorSilaba(index: number): string {
    return this.navigationService.obtenerColorSilaba(index);
  }

  obtenerColorFonema(index: number): string {
    return this.navigationService.obtenerColorFonema(index);
  }

  puedeIrAnterior(): boolean {
    return this.navigationService.puedeIrAnterior(this.stateService.getPalabraActualIndex());
  }

  puedeirSiguiente(): boolean {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();
    return this.navigationService.puedeirSiguiente(currentIndex, totalPalabras);
  }

  obtenerColorBarra(): string {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();
    return this.navigationService.obtenerColorBarraProgreso(currentIndex, totalPalabras);
  }

  actividadCompletada(): boolean {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();
    return this.navigationService.actividadCompletada(currentIndex, totalPalabras);
  }

  obtenerTextoProgreso(): string {
    const currentIndex = this.stateService.getPalabraActualIndex();
    const totalPalabras = this.stateService.getTotalPalabras();
    return this.navigationService.obtenerTextoProgreso(currentIndex, totalPalabras);
  }

  regresar(): void {
    this.audioService.detenerAudio();

    const progressData = this.stateService.getProgressData();
    const progreso = this.stateService.getProgreso();
    const totalPalabras = this.stateService.getTotalPalabras();

    if (this.actividadCompletada()) {
      this.notificationService.confirm(
        'Actividad Completada',
        '¿Deseas volver al menú de actividades?',
        () => this.router.navigate(['/student/galeria-palabras']),
        undefined,
        'Salir',
        'Cancelar'
      );
    } else {
      const mensaje = `Progreso actual: ${progreso.toFixed(0)}%\n` +
        `Palabras completadas: ${progressData?.palabrasCompletadas || 0} de ${totalPalabras}\n\n` +
        '¿Estás seguro de que deseas salir?';

      this.notificationService.confirm(
        'Confirmar salida',
        mensaje,
        () => this.router.navigate(['/student/galeria-palabras']),
        undefined,
        'Salir',
        'Cancelar'
      );
    }
  }

  terminarActividad(): void {
    this.audioService.detenerAudio();
    this.notificationService.confirm(
      '¡Felicidades!',
      'Has completado la actividad exitosamente.',
      () => this.router.navigate(['/student/galeria-palabras']),
      undefined,
      'Finalizar',
      undefined
    );
  }

  onNoticePrimary(): void {
    if (this._primaryCb) this._primaryCb();
    this.notificationService.hide();
  }

  onNoticeSecondary(): void {
    if (this._secondaryCb) this._secondaryCb();
    this.notificationService.hide();
  }
}