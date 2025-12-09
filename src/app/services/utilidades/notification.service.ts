import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';


export interface NotificationConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryAction?: () => void;
  secondaryAction?: () => void;
  stackButtons?: boolean;
}

export interface NotificationState {
  visible: boolean;
  config: NotificationConfig | null;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<NotificationState>();
  public notification$: Observable<NotificationState> = this.notificationSubject.asObservable();

  show(config: NotificationConfig): void {
    this.notificationSubject.next({
      visible: true,
      config: {
        ...config,
        primaryLabel: config.primaryLabel || 'Aceptar',
        stackButtons: config.stackButtons || false
      }
    });
  }

  hide(): void {
    this.notificationSubject.next({
      visible: false,
      config: null
    });
  }

  success(title: string, message: string, primaryAction?: () => void): void {
    this.show({
      title,
      message,
      type: 'success',
      primaryAction
    });
  }

  error(title: string, message: string, primaryAction?: () => void): void {
    this.show({
      title,
      message,
      type: 'error',
      primaryAction
    });
  }

  info(title: string, message: string, primaryAction?: () => void): void {
    this.show({
      title,
      message,
      type: 'info',
      primaryAction
    });
  }

  confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    confirmLabel: string = 'Confirmar',
    cancelLabel: string = 'Cancelar'
  ): void {
    this.show({
      title,
      message,
      type: 'info',
      primaryLabel: confirmLabel,
      secondaryLabel: cancelLabel,
      primaryAction: onConfirm,
      secondaryAction: onCancel
    });
  }

  activityCreatedSuccess(activityName: string, onNavigate: () => void): void {
    this.show({
      title: 'Éxito',
      message: `¡Actividad "${activityName}" creada exitosamente!\n\nLa actividad está disponible para tus estudiantes.`,
      type: 'success',
      primaryLabel: 'Ver actividades',
      primaryAction: onNavigate
    });
  }

  activitySavedLocallyWarning(onNavigate: () => void): void {
    this.show({
      title: 'Guardado Local',
      message: 'La actividad se guardó localmente. Se sincronizará cuando el servidor esté disponible.',
      type: 'success',
      primaryLabel: 'Aceptar',
      primaryAction: onNavigate
    });
  }

  confirmSaveLocalOnly(onConfirm: () => void, onCancel?: () => void): void {
    this.show({
      title: 'Error de Conexión',
      message: 'No se pudo conectar con el servidor.\n\n¿Deseas guardar la actividad solo localmente? Podrás sincronizarla más tarde.',
      type: 'error',
      primaryLabel: 'Sí, guardar local',
      secondaryLabel: 'Cancelar',
      primaryAction: onConfirm,
      secondaryAction: onCancel
    });
  }

  confirmDiscardChanges(onConfirm: () => void): void {
    this.show({
      title: 'Confirmar',
      message: '¿Estás seguro de que deseas salir? Los cambios no guardados se perderán.',
      type: 'info',
      primaryLabel: 'Sí',
      secondaryLabel: 'No',
      primaryAction: onConfirm
    });
  }

  confirmDeleteWord(wordNumber: number, onConfirm: () => void): void {
    this.show({
      title: 'Confirmar',
      message: `¿Estás seguro de que deseas eliminar la palabra ${wordNumber}?`,
      type: 'info',
      primaryLabel: 'Eliminar',
      secondaryLabel: 'Cancelar',
      primaryAction: onConfirm
    });
  }

  showValidationErrors(errors: string[]): void {
    const message = errors.join('\n\n');
    this.show({
      title: 'Errores de Validación',
      message,
      type: 'error'
    });
  }
}