import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ActividadFormService, PalabraCompleta } from '../../services/actividad.service';
import { ActividadNavigationService } from '../../services/actividad.navegation.service';
import { ProgressService, ProgressData } from '../../services/progress.service';
import { AudioPlaybackService } from '../../services/audio-playback.service';
import { ActividadStateService } from '../../services/actividad-state.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { StudentActivityService } from '../../services/student-activity.service';

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
    private route: ActivatedRoute,
    private actividadService: ActividadFormService,
    public navigationService: ActividadNavigationService,
    private progressService: ProgressService,
    private audioService: AudioPlaybackService,
    private stateService: ActividadStateService,
    private studentActivityService: StudentActivityService 
  ) {}

  ngOnInit(): void {
    this.inicializarActividad();
    this.verificarSoporteAudio();
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
      const actividadId = parseInt(id);
      this.stateService.setActividadId(actividadId);
      await this.cargarActividad(actividadId);
    }
  }

  private verificarSoporteAudio(): void {
    if (!this.audioService.isSpeechSupported()) {
      console.warn('Web Speech API no está soportada en este navegador');
    }
  }

  private async cargarActividad(id: number): Promise<void> {
    try {
      const apiResult = await this.studentActivityService.getActivityById(String(id));
      
      if (apiResult.success && apiResult.activity) {
        const actividadLocal = this.studentActivityService.convertToLocalFormat(apiResult.activity);
        
        this.stateService.setPalabras(actividadLocal.palabrasCompletas);
        this.stateService.setTituloActividad(actividadLocal.titulo);
        this.actualizarProgreso();
        
        console.log('Actividad cargada desde API:', {
          titulo: actividadLocal.titulo,
          id: id
        });
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
      this.showNotice('Error', 'No se pudo cargar la actividad', 'error', 'Volver', undefined, () => this.regresar());
    }
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

      if (this.navigationService.actividadCompletada(nuevoIndex, totalPalabras)) {
        setTimeout(() => {
          this.showNotice(
            '¡Excelente trabajo! ¡Lo lograste!',
            'Has completado la actividad.',
            'success',
            'Repetir',
            'Menú',
            () => {
              this.stateService.setPalabraActualIndex(0);
              this.actualizarProgreso();
            },
            () => this.regresar()
          );
        }, 500);
      }
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
      this.showNotice('Error de audio', msg, 'error', 'Aceptar');
    }
  }

  async reproducirSilaba(silaba: string): Promise<void> {
    try {
      await this.audioService.reproducirSilaba(silaba);
    } catch (error) {
      console.error('Error al reproducir sílaba:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la sílaba');
      this.showNotice('Error de audio', msg, 'error', 'Aceptar');
    }
  }

  async reproducirFonema(fonema: string): Promise<void> {
    try {
      await this.audioService.reproducirFonema(fonema);
    } catch (error) {
      console.error('Error al reproducir fonema:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir el fonema');
      this.showNotice('Error de audio', msg, 'error', 'Aceptar');
    }
  }

  async reproducirSecuenciaSilabas(): Promise<void> {
    if (!this.palabraActual) return;
    
    try {
      await this.audioService.reproducirSecuenciaSilabas(this.palabraActual);
    } catch (error) {
      console.error('Error al reproducir secuencia de sílabas:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la secuencia de sílabas');
      this.showNotice('Error de audio', msg, 'error', 'Aceptar');
    }
  }

  async reproducirSecuenciaFonemas(): Promise<void> {
    if (!this.palabraActual) return;
    
    try {
      await this.audioService.reproducirSecuenciaFonemas(this.palabraActual);
    } catch (error) {
      console.error('Error al reproducir secuencia de fonemas:', error);
      const msg = (error && (error as any).message) ? (error as any).message : String(error || 'Error al reproducir la secuencia de fonemas');
      this.showNotice('Error de audio', msg, 'error', 'Aceptar');
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
      const mensaje = '¡Has completado esta actividad!\n\n' +
                      `Palabras vistas: ${progressData?.palabrasCompletadas || 0}\n` +
                      `Progreso: ${progreso.toFixed(0)}%\n\n` +
                      '¿Deseas salir?';

      this.showNotice('Confirmar', mensaje, 'info', 'Sí', 'No', () => this.location.back());
    } else {
      const mensaje = `Progreso actual: ${progreso.toFixed(0)}%\n` +
                      `Palabras completadas: ${progressData?.palabrasCompletadas || 0} de ${totalPalabras}\n\n` +
                      '¿Estás seguro de que deseas salir?';

      this.showNotice('Confirmar', mensaje, 'info', 'Sí', 'No', () => this.location.back());
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