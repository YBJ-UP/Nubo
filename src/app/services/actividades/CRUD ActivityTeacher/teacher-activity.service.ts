import { Injectable } from '@angular/core';
import { ApiConfigService } from '../../utilidades/api-config.service';
import { TeacherAuthService } from '../../authentication/teacher-auth.service';
import { ActivityMapperService } from '../../mappers/activity-mapper.service';

export interface ContentItem {
  id?: string;
  texto: string;
  imagenUrl: string;
  syllables: string[];
  graphemes: string[]; 
}

export interface CreateActivityRequest {
  teacherId: string;
  moduleId: string;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  content: ContentItem[];
}

export interface ActivityResponse {
  id: string;
  teacherId: string;
  moduleId: string;
  title: string;
  thumbnail: string; 
  isPublic: boolean;
  content: ContentItem[];
}

@Injectable({
  providedIn: 'root'
})
export class TeacherActivityService {
  constructor(
    private apiConfig: ApiConfigService,
    private authService: TeacherAuthService,
    private mapper: ActivityMapperService
  ) {}


  async getMyActivities(): Promise<{ 
    success: boolean; 
    message: string; 
    activities?: ActivityResponse[] 
  }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado',
        activities: []
      };
    }

    try {
      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/activities`),
        {
          method: 'GET',
          headers: this.apiConfig.getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || error.message || 'Error al obtener actividades',
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
      console.error('Error al obtener actividades:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        activities: []
      };
    }
  }

  async deleteActivity(activityId: string): Promise<{ 
    success: boolean; 
    message: string 
  }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return { success: false, message: 'No hay un maestro autenticado' };
    }

    try {
      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/activities/${activityId}`),
        {
          method: 'DELETE',
          headers: this.apiConfig.getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || error.message || 'Error al eliminar actividad'
        };
      }

      return {
        success: true,
        message: 'Actividad eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }

  convertContentToApiFormat(localContent: any[]): ContentItem[] {
    return this.mapper.convertToApiFormat(localContent);
  }

  convertToLocalFormat(activity: ActivityResponse): any {
    return this.mapper.convertToLocalFormat(activity);
  }
}