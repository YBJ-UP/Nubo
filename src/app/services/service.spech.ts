import { Injectable } from '@angular/core';

export interface SpeechConfig {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export interface VoiceOption {
  name: string;
  lang: string;
  localService: boolean;
  default: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synthesis: SpeechSynthesis;
  private defaultConfig: SpeechConfig = {
    lang: 'es-MX',
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  getAvailableVoices(): Promise<VoiceOption[]> {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(this.mapVoices(voices));
        return;
      }

      this.synthesis.onvoiceschanged = () => {
        voices = this.synthesis.getVoices();
        resolve(this.mapVoices(voices));
      };
    });
  }

  private mapVoices(voices: SpeechSynthesisVoice[]): VoiceOption[] {
    return voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService,
      default: voice.default
    }));
  }

  async speak(text: string, config?: SpeechConfig): Promise<void> {
    if (!this.isSupported()) {
      console.error('Web Speech API no está soportada en este navegador');
      throw new Error('Speech synthesis no disponible');
    }

    if (!text || text.trim() === '') {
      console.warn('No hay texto para reproducir');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const finalConfig = { ...this.defaultConfig, ...config };

    utterance.lang = finalConfig.lang!;
    utterance.rate = finalConfig.rate!;
    utterance.pitch = finalConfig.pitch!;
    utterance.volume = finalConfig.volume!;

    const voices = await this.getAvailableVoices();
    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    
    if (spanishVoice) {
      const voiceList = this.synthesis.getVoices();
      utterance.voice = voiceList.find(v => v.name === spanishVoice.name) || null;
    }

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        console.log('Reproducción completada');
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Error en speech synthesis:', event);
        reject(event.error);
      };

      this.synthesis.speak(utterance);
    });
  }

  speakWord(word: string): Promise<void> {
    return this.speak(word, {
      rate: 0.8,
      pitch: 1.0
    });
  }

  speakSyllable(syllable: string): Promise<void> {
    return this.speak(syllable, {
      rate: 0.7,
      pitch: 1.1
    });
  }

  speakPhoneme(phoneme: string): Promise<void> {
    return this.speak(phoneme, {
      rate: 0.6,
      pitch: 1.2
    });
  }

  stop(): void {
    if (this.synthesis.speaking || this.synthesis.pending) {
      this.synthesis.cancel();
    }
  }

  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }

  setDefaultConfig(config: Partial<SpeechConfig>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  getDefaultConfig(): SpeechConfig {
    return { ...this.defaultConfig };
  }

  async testVoice(): Promise<void> {
    await this.speak('Hola, soy el asistente de voz de Nubo. ¿Puedes escucharme correctamente?');
  }
}