import { Injectable } from '@angular/core';
import { ApiConfigService } from './api-config.service';
import { StudentAuthService } from './student-auth.service';

interface ActivityContent {
  id?: string;
  texto: string;
  imagenUrl: string;
  silabas: string[];
  grafemas: string[];
}

interface ActivityResponse {
  id: string;
  teacherId: string;
  moduleId: string;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  content: ActivityContent[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentActivityService {
  constructor(
    private apiConfig: ApiConfigService,
    private studentAuth: StudentAuthService
  ) {}

  async getAllPublicActivities(): Promise<{
    success: boolean;
    message: string;
    activities?: ActivityResponse[];
  }> {
    try {
      const response = await fetch(
        this.apiConfig.getEndpoint('/activities'),
        {
          method: 'GET',
          headers: this.apiConfig.getCommonHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Error al obtener actividades',
          activities: []
        };
      }

      const activities: ActivityResponse[] = await response.json();

      return {
        success: true,
        message: 'Actividades obtenidas exitosamente',
        activities
      };
    } catch (error) {
      console.error('Error al obtener actividades públicas:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        activities: []
      };
    }
  }

  async getActivityById(activityId: string): Promise<{
    success: boolean;
    message: string;
    activity?: ActivityResponse;
  }> {
    try {
      const response = await fetch(
        this.apiConfig.getEndpoint(`/activities/${activityId}`),
        {
          method: 'GET',
          headers: this.apiConfig.getCommonHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Actividad no encontrada'
        };
      }

      const activity: ActivityResponse = await response.json();

      return {
        success: true,
        message: 'Actividad obtenida exitosamente',
        activity
      };
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  async getActivitiesByModule(moduleId: string): Promise<{
    success: boolean;
    message: string;
    activities?: ActivityResponse[];
  }> {
    try {
      const result = await this.getAllPublicActivities();

      if (!result.success || !result.activities) {
        return result;
      }

      const filteredActivities = result.activities.filter(
        activity => activity.moduleId === moduleId
      );

      return {
        success: true,
        message: 'Actividades filtradas exitosamente',
        activities: filteredActivities
      };
    } catch (error) {
      console.error('Error al filtrar actividades por módulo:', error);
      return {
        success: false,
        message: 'Error al filtrar actividades',
        activities: []
      };
    }
  }

  convertToLocalFormat(activity: ActivityResponse): any {
    return {
      id: activity.id,
      titulo: activity.title,
      imagenPortada: activity.thumbnail,
      palabrasCompletas: activity.content.map((item, index) => ({
        id: index + 1,
        palabra: item.texto,
        imagenUrl: item.imagenUrl,
        silabas: item.silabas.map((s, i) => ({ id: i, texto: s })),
        fonemas: item.grafemas.map((g, i) => ({ id: i, texto: g }))
      })),
      fechaCreacion: new Date()
    };
  }

  convertArrayToLocalFormat(activities: ActivityResponse[]): any[] {
    return activities.map(activity => this.convertToLocalFormat(activity));
  }

  readonly MODULE_IDS = {
    COGNITIVE: '14387d49-4a1a-47d1-aa47-5a700db3493a', 
    LUDIC: '6297d1fa-a65f-43cd-8070-5960bd89215b'     
  };

  async getCognitiveActivities(): Promise<{
    success: boolean;
    message: string;
    activities?: ActivityResponse[];
  }> {
    return this.getActivitiesByModule(this.MODULE_IDS.COGNITIVE);
  }

  async getLudicActivities(): Promise<{
    success: boolean;
    message: string;
    activities?: ActivityResponse[];
  }> {
    return this.getActivitiesByModule(this.MODULE_IDS.LUDIC);
  }
}