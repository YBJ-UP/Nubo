import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { ActivityService } from '../actividades/CRUD ActivityTeacher/palabras-actividad';
import { ActivityValidationService } from '../actividades/activity-validation.service';
import { ActivityFormStateService } from '../actividades/activity-form-state.service';
import { NotificationService } from '../utilidades/notification.service';
import { WordManagerService } from '../utilidades/word-manager.service';
import { TeacherAuthService } from '../authentication/teacher-auth.service';
import { PalabraCompleta } from '../actividades/actividad.service';

@Injectable()
export class CrearActividadPresenter implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private location: Location,
    private validationService: ActivityValidationService,
    private stateService: ActivityFormStateService,
    private notificationService: NotificationService,
    private wordManager: WordManagerService,
    private authService: TeacherAuthService,
    private activityService: ActivityService 
  ) {}

  ngOnDestroy(): void {
    this.cleanup();
  }

  initialize(): void {
    this.checkAuth();
    this.initializeFirstWord();
  }

  private checkAuth(): void {
    if (!this.authService.isAuthenticated()) {
      console.warn('Usuario no autenticado');
      this.router.navigate(['/login']);
    }
  }

  private initializeFirstWord(): void {
    const firstWord = this.wordManager.createEmptyWord();
    this.stateService.updatePalabrasCompletas([firstWord]);
  }

  cleanup(): void {
    this.stateService.resetState(); 
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleInstructions(): void {
    this.stateService.toggleInstrucciones();
  }

  triggerPortadaUpload(): void {
    const input = document.getElementById('portadaInput') as HTMLInputElement;
    if (input) input.click();
  }

  async handlePortadaUpload(event: Event): Promise<void> {
    const file = this.getFileFromEvent(event);
    if (!file) return;

    try {
      const base64 = await this.convertFileToBase64(file);
      this.stateService.updateImagenPortada(base64);
    } catch (error) {
      console.error(error);
      this.notificationService.error('Error','Error al procesar la imagen de portada');
    }
  }

  triggerWordImageUpload(index: number): void {
    const input = document.getElementById(`imagenInput-${index}`) as HTMLInputElement;
    if (input) input.click();
  }

  async handleWordImageUpload(event: Event, wordIndex: number, currentWords: PalabraCompleta[]): Promise<void> {
    const file = this.getFileFromEvent(event);
    if (!file) return;

    try {
      const base64 = await this.convertFileToBase64(file);
      const updatedWord = this.wordManager.updateWordImage(
        currentWords[wordIndex],
        base64
      );
      this.stateService.updatePalabraAt(wordIndex, updatedWord);
    } catch (error) {
      console.error(error);
      this.notificationService.error('Error','Error al procesar la imagen');
    }
  }

  addSyllable(wordIndex: number, currentWords: PalabraCompleta[]): void {
    const updatedWord = this.wordManager.addSyllable(currentWords[wordIndex]);
    this.stateService.updatePalabraAt(wordIndex, updatedWord);
  }

  removeSyllable(wordIndex: number, syllableId: number, currentWords: PalabraCompleta[]): void {
    const result = this.wordManager.removeSyllable(currentWords[wordIndex], syllableId);
    if (result.success && result.palabra) {
      this.stateService.updatePalabraAt(wordIndex, result.palabra);
    }
  }

  addPhoneme(wordIndex: number, currentWords: PalabraCompleta[]): void {
    const updatedWord = this.wordManager.addPhoneme(currentWords[wordIndex]);
    this.stateService.updatePalabraAt(wordIndex, updatedWord);
  }

  removePhoneme(wordIndex: number, phonemeId: number, currentWords: PalabraCompleta[]): void {
    const result = this.wordManager.removePhoneme(currentWords[wordIndex], phonemeId);
    if (result.success && result.palabra) {
      this.stateService.updatePalabraAt(wordIndex, result.palabra);
    }
  }

  addNewWord(): void {
    const newWord = this.wordManager.createEmptyWord();
    this.stateService.addPalabraCompleta(newWord);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  removeWord(index: number, currentWords: PalabraCompleta[]): void {
    if (!this.wordManager.canRemoveWord(currentWords.length)) {
      this.notificationService.error('Error','Debe haber al menos una palabra.');
      return;
    }
    this.stateService.removePalabraCompleta(index);
  }

  async saveActivity(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<void> {
    if (!this.validateActivity(titulo, imagenPortada, palabrasCompletas)) return;
    this.stateService.setSubmitting(true)

    try {
      const moduleIdFijo = "14387d49-4a1a-47d1-aa47-5a700db3493a"; 

      const result = await this.activityService.createActivity(
        titulo,
        imagenPortada,
        palabrasCompletas,
        moduleIdFijo
      );
      this.stateService.setSubmitting(false);
      if (result.success) {
        this.notificationService.activityCreatedSuccess(
            titulo, 
            () => this.navigateToActivities()
        );
        this.stateService.resetState();
      } else {
        this.notificationService.error('Error al guardar', result.message);
      }

    } catch (error) {
      this.stateService.setSubmitting(false);
      console.error(error);
      this.notificationService.error('Error de conexión', 'No se pudo conectar con el servidor');
    }
  }

  private validateActivity(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): boolean {
    const validation = this.validationService.validateActivityForm(
      titulo,
      imagenPortada,
      palabrasCompletas
    );

    if (!validation.isValid) {
      this.notificationService.showValidationErrors(validation.errors);
      return false;
    }
    return true;
  }

  goBack(titulo: string, imagenPortada: string, palabrasCompletas: PalabraCompleta[]): void {
    this.location.back();
  }

  private navigateToActivities(): void {
    this.router.navigate(['/teacher/activities']); 
  }

  private scrollToBottom(): void {
    const container = document.querySelector('.main-container');
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  getDestroySubject(): Subject<void> {
    return this.destroy$;
  }

  private getFileFromEvent(event: Event): File | null {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      return input.files[0];
    }
    return null;
  }

  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}