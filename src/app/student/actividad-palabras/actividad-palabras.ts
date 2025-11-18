import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ActividadFormService, PalabraCompleta } from '../../services/actividad.service';
import { ActividadNavigationService } from '../../services/actividad.navegation.service';
import { ProgressService, ProgressData } from '../../services/progress.service';
import { SpeechService } from '../../services/speech.service';

@Component({
  selector: 'app-actividad-palabras',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './actividad-palabras.html',
  styleUrl: './actividad-palabras.css'
})
export class ActividadPalabras implements OnInit, OnDestroy {
  palabras: PalabraCompleta[] = [];
  palabraActualIndex: number = 0;
  progreso: number = 0;
  actividadId: number | null = null;
  tituloActividad: string = '';
  progressData: ProgressData | null = null;
  
  // Estados de audio
  isPlayingAudio: boolean = false;
  audioError: string | null = null;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private actividadService: ActividadFormService,
    public navigationService: ActividadNavigationService,
    private progressService: ProgressService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.actividadId = parseInt(id);
      this.cargarActividad(this.actividadId);
    }

    // Verificar soporte de Web Speech API
    if (!this.speechService.isSupported()) {
      console.warn('Web Speech API no está soportada en este navegador');
      this.audioError = 'Audio no disponible en este navegador';
    }
  }

  ngOnDestroy(): void {
    // Detener cualquier reproducción al salir del componente
    this.speechService.stop();
  }

  cargarActividad(id: number): void {
    const actividad = this.actividadService.getActividadById(id);
    
    if (actividad && actividad.palabrasCompletas) {
      this.palabras = actividad.palabrasCompletas;
      this.tituloActividad = actividad.titulo;
      this.actualizarProgreso();
      console.log('Actividad cargada:', {
        titulo: actividad.titulo,
        totalPalabras: this.palabras.length,
        id: actividad.id
      });
    } else {
      console.error('Actividad no encontrada o sin palabras');
      alert('No se pudo cargar la actividad');
      this.regresar();
    }
  }

  get palabraActual(): PalabraCompleta | null {
    return this.palabras[this.palabraActualIndex] || null;
  }

  anteriorPalabra(): void {
    if (this.navigationService.puedeIrAnterior(this.palabraActualIndex)) {
      this.speechService.stop();
      this.palabraActualIndex = this.navigationService.obtenerAnteriorIndice(this.palabraActualIndex);
      this.actualizarProgreso();
      console.log('Navegando a palabra anterior:', this.palabraActualIndex + 1);
    }
  }

  siguientePalabra(): void {
    if (this.navigationService.puedeirSiguiente(this.palabraActualIndex, this.palabras.length)) {
      this.speechService.stop();
      this.palabraActualIndex = this.navigationService.obtenerSiguienteIndice(
        this.palabraActualIndex, 
        this.palabras.length
      );
      this.actualizarProgreso();
      console.log('Navegando a siguiente palabra:', this.palabraActualIndex + 1);

      if (this.navigationService.actividadCompletada(this.palabraActualIndex, this.palabras.length)) {
        setTimeout(() => {
          alert('¡Felicidades! Has completado la actividad.');
        }, 500);
      }
    }
  }

  private actualizarProgreso(): void {
    this.progreso = this.navigationService.calcularProgreso(
      this.palabraActualIndex, 
      this.palabras.length
    );
    
    this.progressData = this.progressService.obtenerDatosProgreso(
      this.palabraActualIndex,
      this.palabras.length
    );
  }

  // Métodos de reproducción de audio
  async reproducirPalabraCompleta(): Promise<void> {
    if (!this.palabraActual || this.isPlayingAudio) return;

    try {
      this.isPlayingAudio = true;
      this.audioError = null;
      await this.speechService.speakWord(this.palabraActual.palabra);
    } catch (error) {
      console.error('Error al reproducir palabra:', error);
      this.audioError = 'Error al reproducir audio';
    } finally {
      this.isPlayingAudio = false;
    }
  }

  async reproducirSilaba(silaba: string): Promise<void> {
    if (!silaba || this.isPlayingAudio) return;

    try {
      this.isPlayingAudio = true;
      this.audioError = null;
      await this.speechService.speakSyllable(silaba);
    } catch (error) {
      console.error('Error al reproducir sílaba:', error);
      this.audioError = 'Error al reproducir audio';
    } finally {
      this.isPlayingAudio = false;
    }
  }

  async reproducirFonema(fonema: string): Promise<void> {
    if (!fonema || this.isPlayingAudio) return;

    try {
      this.isPlayingAudio = true;
      this.audioError = null;
      await this.speechService.speakPhoneme(fonema);
    } catch (error) {
      console.error('Error al reproducir fonema:', error);
      this.audioError = 'Error al reproducir audio';
    } finally {
      this.isPlayingAudio = false;
    }
  }

  async reproducirSecuenciaSilabas(): Promise<void> {
    if (!this.palabraActual || this.isPlayingAudio) return;

    try {
      this.isPlayingAudio = true;
      this.audioError = null;

      for (const silaba of this.palabraActual.silabas) {
        if (silaba.texto.trim()) {
          await this.speechService.speakSyllable(silaba.texto);
          // Pequeña pausa entre sílabas
          await this.delay(300);
        }
      }

      // Reproducir palabra completa al final
      await this.delay(500);
      await this.speechService.speakWord(this.palabraActual.palabra);

    } catch (error) {
      console.error('Error al reproducir secuencia:', error);
      this.audioError = 'Error al reproducir audio';
    } finally {
      this.isPlayingAudio = false;
    }
  }

  async reproducirSecuenciaFonemas(): Promise<void> {
    if (!this.palabraActual || this.isPlayingAudio) return;

    try {
      this.isPlayingAudio = true;
      this.audioError = null;

      for (const fonema of this.palabraActual.fonemas) {
        if (fonema.texto.trim()) {
          await this.speechService.speakPhoneme(fonema.texto);
          await this.delay(250);
        }
      }

    } catch (error) {
      console.error('Error al reproducir secuencia de fonemas:', error);
      this.audioError = 'Error al reproducir audio';
    } finally {
      this.isPlayingAudio = false;
    }
  }

  detenerAudio(): void {
    this.speechService.stop();
    this.isPlayingAudio = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Métodos existentes
  obtenerColorSilaba(index: number): string {
    return this.navigationService.obtenerColorSilaba(index);
  }

  obtenerColorFonema(index: number): string {
    return this.navigationService.obtenerColorFonema(index);
  }

  puedeIrAnterior(): boolean {
    return this.navigationService.puedeIrAnterior(this.palabraActualIndex);
  }

  puedeirSiguiente(): boolean {
    return this.navigationService.puedeirSiguiente(this.palabraActualIndex, this.palabras.length);
  }

  obtenerColorBarra(): string {
    return this.navigationService.obtenerColorBarraProgreso(
      this.palabraActualIndex,
      this.palabras.length
    );
  }

  actividadCompletada(): boolean {
    return this.navigationService.actividadCompletada(
      this.palabraActualIndex,
      this.palabras.length
    );
  }

  obtenerTextoProgreso(): string {
    return this.navigationService.obtenerTextoProgreso(
      this.palabraActualIndex,
      this.palabras.length
    );
  }

  regresar(): void {
    this.speechService.stop();
    
    if (this.actividadCompletada()) {
      const mensaje = '¡Has completado esta actividad!\n\n' +
                     `Palabras vistas: ${this.progressData?.palabrasCompletadas || 0}\n` +
                     `Progreso: ${this.progreso.toFixed(0)}%\n\n` +
                     '¿Deseas salir?';
      
      if (confirm(mensaje)) {
        this.location.back();
      }
    } else {
      const mensaje = `Progreso actual: ${this.progreso.toFixed(0)}%\n` +
                     `Palabras completadas: ${this.progressData?.palabrasCompletadas || 0} de ${this.palabras.length}\n\n` +
                     '¿Estás seguro de que deseas salir?';
      
      if (confirm(mensaje)) {
        this.location.back();
      }
    }
  }
}