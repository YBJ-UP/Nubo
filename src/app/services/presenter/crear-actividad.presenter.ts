import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

import { PalabraCompleta } from '../actividades/actividad.service';
import { ActivityValidationService } from '../actividades/activity-validation.service';
import { ActivityFormStateService } from '../actividades/activity-form-state.service';
import { ActivitySyncService, SyncResult } from '../actividades/activity-sync.service';
import { NotificationService } from '../utilidades/notification.service';
import { WordManagerService } from '../utilidades/word-manager.service';
import { ImageUploadService } from '../utilidades/image-upload.service';
import { TeacherAuthService } from '../autenticacion/teacher-auth.service';

@Injectable()
export class CrearActividadPresenter implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private location: Location,
    private validationService: ActivityValidationService,
    private stateService: ActivityFormStateService,
    private syncService: ActivitySyncService,
    private notificationService: NotificationService,
    private wordManager: WordManagerService,
    private imageUpload: ImageUploadService,
    private authService: TeacherAuthService
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
      this.notificationService.error(
        'Error',
        'Debes iniciar sesión para crear actividades',
        () => this.router.navigate(['/login'])
      );
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
    this.imageUpload.triggerFileInput(this.imageUpload.getPortadaInputId());
  }

  async handlePortadaUpload(event: Event): Promise<void> {
    const result = await this.imageUpload.uploadImage(event);
    
    if (result.success && result.imageUrl) {
      this.stateService.updateImagenPortada(result.imageUrl);
    } else {
      this.notificationService.error('Error', result.message);
    }
  }

  triggerWordImageUpload(index: number): void {
    this.imageUpload.triggerFileInput(this.imageUpload.getWordImageInputId(index));
  }

  async handleWordImageUpload(event: Event, wordIndex: number, currentWords: PalabraCompleta[]): Promise<void> {
    const result = await this.imageUpload.uploadImage(event);
    
    if (result.success && result.imageUrl) {
      const updatedWord = this.wordManager.updateWordImage(
        currentWords[wordIndex],
        result.imageUrl
      );
      this.stateService.updatePalabraAt(wordIndex, updatedWord);
    } else {
      this.notificationService.error('Error', result.message);
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
    } else {
      this.notificationService.error('Error', result.message || 'Error al eliminar sílaba');
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
    } else {
      this.notificationService.error('Error', result.message || 'Error al eliminar fonema');
    }
  }

  addNewWord(): void {
    const newWord = this.wordManager.createEmptyWord();
    this.stateService.addPalabraCompleta(newWord);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  removeWord(index: number, currentWords: PalabraCompleta[]): void {
    if (!this.wordManager.canRemoveWord(currentWords.length)) {
      this.notificationService.error(
        'Error',
        'Debe haber al menos una palabra en la actividad.'
      );
      return;
    }

    this.notificationService.confirmDeleteWord(index + 1, () => {
      this.stateService.removePalabraCompleta(index);
    });
  }

  async saveActivity(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<void> {
    const validation = this.validateActivity(titulo, imagenPortada, palabrasCompletas);
    if (!validation) return;

    this.stateService.setSubmitting(true);

    try {
      const result = await this.syncService.saveActivity(titulo, imagenPortada, palabrasCompletas);
      this.handleSaveResult(result, titulo);
    } catch (error) {
      this.handleSaveError(titulo, imagenPortada, palabrasCompletas);
    } finally {
      this.stateService.setSubmitting(false);
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

  private handleSaveResult(result: SyncResult, activityName: string): void {
    if (result.success && result.syncedToApi) {
      this.notificationService.activityCreatedSuccess(
        activityName,
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

  private handleSaveError(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): void {
    this.notificationService.confirmSaveLocalOnly(
      async () => {
        const result = await this.syncService.saveLocalOnly(
          titulo,
          imagenPortada,
          palabrasCompletas
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

  goBack(titulo: string, imagenPortada: string, palabrasCompletas: PalabraCompleta[]): void {
    const hasChanges = this.validationService.hasUnsavedChanges(
      titulo,
      imagenPortada,
      palabrasCompletas
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
    container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }

  getDestroySubject(): Subject<void> {
    return this.destroy$;
  }
}