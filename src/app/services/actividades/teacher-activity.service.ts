// src/app/services/teacher-activity.service.ts
import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../authentication/teacher-auth.service';
import { ActivityMapperService } from '../mappers/activity-mapper.service';

/**
 * Identificadores de módulos en el sistema
 * Estos UUIDs deben coincidir exactamente con los de la base de datos
 */
interface ModuleIds {
  COGNITIVE: string;  // Módulo de actividades cognitivas
  LUDIC: string;      // Módulo de juegos lúdicos
}

interface ContentItem {
  id?: string;
  texto: string;
  imagenUrl: string;
  silabas: string[];
  grafemas: string[];
}

interface CreateActivityRequest {
  teacherId: string;
  moduleId: string;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  content: ContentItem[];
}

interface ActivityResponse {
  id: string;
  teacherId: string;
  moduleId: string;
  title: string;
  thumbnail: string;
  isPublic: boolean;
  content: ContentItem[];
}

/**
 * Servicio para gestionar actividades de maestros
 * Maneja la comunicación con la API para CRUD de actividades
 */
@Injectable({
  providedIn: 'root'
})
export class TeacherActivityService {
  
  /**
   * IDs de módulos del sistema
   * IMPORTANTE: Estos deben coincidir con los UUIDs en tu base de datos
   */
  private readonly MODULE_IDS: ModuleIds = {
    COGNITIVE: '14387d49-4a1a-47d1-aa47-5a700db3493a',
    LUDIC: '6297d1fa-a65f-43cd-8070-5960bd89215b'
  };

  constructor(
    private apiConfig: ApiConfigService,
    private authService: TeacherAuthService,
    private mapper: ActivityMapperService
  ) {}

  /**
   * Crea una actividad cognitiva (Módulo 1)
   */
  async createCognitiveActivity(activityData: {
    title: string;
    thumbnail: string;
    isPublic: boolean;
    content: ContentItem[];
  }): Promise<{ success: boolean; message: string; activity?: ActivityResponse }> {
    return this.createActivity({
      ...activityData,
      moduleId: this.MODULE_IDS.COGNITIVE
    });
  }

  /**
   * Crea una actividad de memorama (Módulo 2)
   */
  async createMemoramaActivity(activityData: {
    title: string;
    thumbnail: string;
    isPublic: boolean;
    content: ContentItem[];
  }): Promise<{ success: boolean; message: string; activity?: ActivityResponse }> {
    return this.createActivity({
      ...activityData,
      moduleId: this.MODULE_IDS.LUDIC
    });
  }

  /**
   * Método privado para crear cualquier tipo de actividad
   */
  private async createActivity(activityData: {
    title: string;
    thumbnail: string;
    isPublic: boolean;
    content: ContentItem[];
    moduleId: string;
  }): Promise<{ success: boolean; message: string; activity?: ActivityResponse }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado'
      };
    }

    try {
      const requestData: CreateActivityRequest = {
        teacherId: teacher.id,
        moduleId: activityData.moduleId,
        title: activityData.title,
        thumbnail: activityData.thumbnail,
        isPublic: activityData.isPublic,
        content: activityData.content
      };

      const response = await fetch(
        this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities`),
        {
          method: 'POST',
          headers: this.apiConfig.getAuthHeaders(),
          body: JSON.stringify(requestData)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Error al crear actividad'
        };
      }

      const activity: ActivityResponse = await response.json();
      
      return {
        success: true,
        message: 'Actividad creada exitosamente',
        activity
      };
    } catch (error) {
      console.error('Error al crear actividad:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Obtiene todas las actividades del maestro autenticado
   */
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
        this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities`),
        {
          method: 'GET',
          headers: this.apiConfig.getAuthHeaders()
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
      console.error('Error al obtener actividades:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor',
        activities: []
      };
    }
  }

  /**
   * Elimina una actividad específica
   * Verifica que el maestro sea el dueño de la actividad
   */
  async deleteActivity(activityId: string): Promise<{ 
    success: boolean; 
    message: string 
  }> {
    const teacher = this.authService.getCurrentTeacher();
    
    if (!teacher) {
      return {
        success: false,
        message: 'No hay un maestro autenticado'
      };
    }

    try {
      const response = await fetch(
        this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities/${activityId}`),
        {
          method: 'DELETE',
          headers: this.apiConfig.getAuthHeaders()
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || 'Error al eliminar actividad'
        };
      }

      return {
        success: true,
        message: 'Actividad eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      return {
        success: false,
        message: 'Error de conexión con el servidor'
      };
    }
  }

  /**
   * Convierte contenido local al formato de la API
   * Delega al servicio mapper
   */
  convertContentToApiFormat(localContent: any[]): ContentItem[] {
    return this.mapper.convertToApiFormat(localContent);
  }

  /**
   * Convierte actividad de API a formato local
   * Delega al servicio mapper
   */
  convertToLocalFormat(activity: ActivityResponse): any {
    return this.mapper.convertToLocalFormat(activity);
  }
}