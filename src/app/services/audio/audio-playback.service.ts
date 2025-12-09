import { Injectable } from '@angular/core';
import { SpeechService } from '../audio/service.spech';
import { PalabraCompleta } from '../../interfaces/actividad-completa';
export interface AudioState {
  isPlaying: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AudioPlaybackService {
  private audioState: AudioState = {
    isPlaying: false,
    error: null
  };

  constructor(private speechService: SpeechService) { }

  getAudioState(): AudioState {
    return { ...this.audioState };
  }

  isPlaying(): boolean {
    return this.audioState.isPlaying;
  }

  hasError(): boolean {
    return this.audioState.error !== null;
  }

  getError(): string | null {
    return this.audioState.error;
  }

  isSpeechSupported(): boolean {
    return this.speechService.isSupported();
  }

  private setPlaying(isPlaying: boolean): void {
    this.audioState.isPlaying = isPlaying;
  }

  private setError(error: string | null): void {
    this.audioState.error = error;
  }

  private clearError(): void {
    this.audioState.error = null;
  }

  async reproducirPalabra(palabra: string): Promise<void> {
    if (!palabra || this.audioState.isPlaying) {
      return;
    }

    try {
      this.setPlaying(true);
      this.clearError();
      await this.speechService.speakWord(palabra);
    } catch (error) {
      console.error('Error al reproducir palabra:', error);
      this.setError('Error al reproducir audio de palabra');
      throw error;
    } finally {
      this.setPlaying(false);
    }
  }

  async reproducirSilaba(silaba: string): Promise<void> {
    if (!silaba || this.audioState.isPlaying) {
      return;
    }

    try {
      this.setPlaying(true);
      this.clearError();
      await this.speechService.speakSyllable(silaba);
    } catch (error) {
      console.error('Error al reproducir sílaba:', error);
      this.setError('Error al reproducir audio de sílaba');
      throw error;
    } finally {
      this.setPlaying(false);
    }
  }

  async reproducirFonema(fonema: string): Promise<void> {
    if (!fonema || this.audioState.isPlaying) {
      return;
    }

    try {
      this.setPlaying(true);
      this.clearError();
      await this.speechService.speakPhoneme(fonema);
    } catch (error) {
      console.error('Error al reproducir fonema:', error);
      this.setError('Error al reproducir audio de fonema');
      throw error;
    } finally {
      this.setPlaying(false);
    }
  }

  async reproducirSecuenciasyllables(palabraCompleta: PalabraCompleta): Promise<void> {
    if (!palabraCompleta || this.audioState.isPlaying) {
      return;
    }

    try {
      this.setPlaying(true);
      this.clearError();

      for (const silaba of palabraCompleta.syllables) {
        if (silaba.texto.trim()) {
          await this.speechService.speakSyllable(silaba.texto);
          await this.delay(300);
        }
      }

      await this.delay(500);

      await this.speechService.speakWord(palabraCompleta.palabra);

    } catch (error) {
      console.error('Error al reproducir secuencia de sílabas:', error);
      this.setError('Error al reproducir secuencia de sílabas');
      throw error;
    } finally {
      this.setPlaying(false);
    }
  }

  async reproducirSecuenciaFonemas(palabraCompleta: PalabraCompleta): Promise<void> {
    if (!palabraCompleta || this.audioState.isPlaying) {
      return;
    }

    try {
      this.setPlaying(true);
      this.clearError();

      for (const fonema of palabraCompleta.fonemas) {
        if (fonema.texto.trim()) {
          await this.speechService.speakPhoneme(fonema.texto);
          await this.delay(250);
        }
      }

    } catch (error) {
      console.error('Error al reproducir secuencia de fonemas:', error);
      this.setError('Error al reproducir secuencia de fonemas');
      throw error;
    } finally {
      this.setPlaying(false);
    }
  }

  detenerAudio(): void {
    this.speechService.stop();
    this.setPlaying(false);
    this.clearError();
  }

  pausarAudio(): void {
    this.speechService.pause();
  }

  reanudarAudio(): void {
    this.speechService.resume();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  limpiarEstado(): void {
    this.detenerAudio();
    this.clearError();
  }
}