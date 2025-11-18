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
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private defaultConfig: SpeechConfig = {
    lang: 'es-MX',
    rate: 0.85,
    pitch: 1.15,
    volume: 1.0
  };

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeVoice();
  }

  private async initializeVoice(): Promise<void> {
    const voices = await this.getAvailableVoices();
    this.selectedVoice = this.selectBestVoice(voices);
    console.log('Voz seleccionada:', this.selectedVoice?.name || 'Voz predeterminada del sistema');
  }

  private selectBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    const preferredVoices = [
      'Google español de Estados Unidos',
      'Microsoft Helena Online (Natural) - Spanish (Mexico)',
      'Microsoft Sabina - Spanish (Mexico)',
      'Paulina',
      'Monica',
      'es-MX-DaliaNeural',
      'es-ES-ElviraNeural'
    ];

    for (const prefName of preferredVoices) {
      const voice = voices.find(v => v.name.includes(prefName));
      if (voice) return voice;
    }

    const femaleSpanishVoice = voices.find(v => 
      v.lang.startsWith('es') && 
      (v.name.toLowerCase().includes('female') || 
       v.name.toLowerCase().includes('mujer') ||
       v.name.includes('Monica') ||
       v.name.includes('Paulina') ||
       v.name.includes('Dalia') ||
       v.name.includes('Helena') ||
       v.name.includes('Elvira'))
    );
    if (femaleSpanishVoice) return femaleSpanishVoice;

    const mexicanVoice = voices.find(v => v.lang === 'es-MX');
    if (mexicanVoice) return mexicanVoice;

    const spanishVoice = voices.find(v => v.lang.startsWith('es'));
    if (spanishVoice) return spanishVoice;

    return null;
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
        return;
      }

      this.synthesis.onvoiceschanged = () => {
        voices = this.synthesis.getVoices();
        resolve(voices);
      };
    });
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

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    } else {
      const voices = await this.getAvailableVoices();
      this.selectedVoice = this.selectBestVoice(voices);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
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
      rate: 0.75,
      pitch: 1.2
    });
  }

  speakSyllable(syllable: string): Promise<void> {
    return this.speak(syllable, {
      rate: 0.65,
      pitch: 1.25
    });
  }

  speakPhoneme(phoneme: string): Promise<void> {
    return this.speak(phoneme, {
      rate: 0.55,
      pitch: 1.3
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

  async setVoice(voiceName: string): Promise<boolean> {
    const voices = await this.getAvailableVoices();
    const voice = voices.find(v => v.name === voiceName);
    
    if (voice) {
      this.selectedVoice = voice;
      console.log('Voz cambiada a:', voice.name);
      return true;
    }
    
    return false;
  }

  async listSpanishVoices(): Promise<VoiceOption[]> {
    const allVoices = await this.getAvailableVoices();
    const spanishVoices = allVoices
      .filter(v => v.lang.startsWith('es'))
      .map(v => ({
        name: v.name,
        lang: v.lang,
        localService: v.localService,
        default: v.default
      }));
    
    console.log('Voces en español disponibles:', spanishVoices);
    return spanishVoices;
  }

  async testVoice(): Promise<void> {
    await this.speak('Hola, soy tu asistente de voz. ¿Me escuchas bien?');
  }
}