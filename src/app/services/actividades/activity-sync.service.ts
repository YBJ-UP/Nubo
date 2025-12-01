import { Injectable } from '@angular/core';
import { PalabraCompleta } from './actividad.service';
import { TeacherActivityService } from './teacher-activity.service';
import { ActividadFormService } from './actividad.service';

export interface SyncResult {
  success: boolean;
  message: string;
  activityId?: string;
  syncedToApi: boolean;
  savedLocally: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActivitySyncService {
  constructor(
    private teacherActivityService: TeacherActivityService,
    private actividadFormService: ActividadFormService
  ) {}

  async saveActivity(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<SyncResult> {

    const localResult = await this.actividadFormService.guardarActividadCompleta(
      titulo,
      imagenPortada,
      palabrasCompletas
    );

    if (!localResult.exito) {
      return {
        success: false,
        message: localResult.mensaje,
        syncedToApi: false,
        savedLocally: false
      };
    }

    try {
      const apiResult = await this.syncToApi(titulo, imagenPortada, palabrasCompletas);

      if (apiResult.success) {
        return {
          success: true,
          message: 'Actividad creada y sincronizada exitosamente',
          activityId: apiResult.activity?.id,
          syncedToApi: true,
          savedLocally: true
        };
      } else {
        return {
          success: true,
          message: 'Actividad guardada localmente. No se pudo sincronizar con el servidor.',
          syncedToApi: false,
          savedLocally: true
        };
      }
    } catch (error) {
      console.error('Error al sincronizar con API:', error);
      return {
        success: true,
        message: 'Actividad guardada localmente. Se sincronizará cuando el servidor esté disponible.',
        syncedToApi: false,
        savedLocally: true
      };
    }
  }

  private async syncToApi(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<any> {
    const contentForApi = this.teacherActivityService.convertContentToApiFormat(palabrasCompletas);

    return await this.teacherActivityService.createCognitiveActivity({
      title: titulo,
      thumbnail: imagenPortada,
      isPublic: true,
      content: contentForApi
    });
  }

  async saveLocalOnly(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[]
  ): Promise<SyncResult> {
    const result = await this.actividadFormService.guardarActividadCompleta(
      titulo,
      imagenPortada,
      palabrasCompletas
    );

    return {
      success: result.exito,
      message: result.mensaje,
      syncedToApi: false,
      savedLocally: result.exito
    };
  }

  getPendingSyncActivities(): any[] {
    const actividades = this.actividadFormService.getAllActividades();
    return actividades.filter((act: any) => !act.sincronizado);
  }

  markAsSynced(activityId: number): void {
    const actividades = this.actividadFormService.getAllActividades();
    const index = actividades.findIndex((act: any) => act.id === activityId);
    
    if (index !== -1) {
      actividades[index].sincronizado = true;
      localStorage.setItem('actividades_cognitivas', JSON.stringify(actividades));
    }
  }
}