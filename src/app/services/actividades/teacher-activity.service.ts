import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../autenticacion/teacher-auth.service';
import { ActivityMapperService } from '../mappers/activity-mapper.service';

interface ModuleIds {
  COGNITIVE: string;
  LUDIC: string;
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

@Injectable({
  providedIn: 'root'
})
export class TeacherActivityService {
  
  private readonly MODULE_IDS: ModuleIds = {
    COGNITIVE: '14387d49-4a1a-47d1-aa47-5a700db3493a',
    LUDIC: '6297d1fa-a65f-43cd-8070-5960bd89215b'
  };

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService,
    private authService: TeacherAuthService,
    private mapper: ActivityMapperService
  ) {}

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

      const activity = await firstValueFrom(
        this.http.post<ActivityResponse>(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities`),
          requestData,
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );
      
      return {
        success: true,
        message: 'Actividad creada exitosamente',
        activity
      };
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      return {
        success: false,
        message: error.error?.error || 'Error de conexión con el servidor'
      };
    }
  }

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
      const activities = await firstValueFrom(
        this.http.get<ActivityResponse[]>(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities`),
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );
      
      return {
        success: true,
        message: 'Actividades obtenidas exitosamente',
        activities
      };
    } catch (error: any) {
      console.error('Error al obtener actividades:', error);
      return {
        success: false,
        message: error.error?.error || 'Error de conexión con el servidor',
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
      return {
        success: false,
        message: 'No hay un maestro autenticado'
      };
    }

    try {
      await firstValueFrom(
        this.http.delete(
          this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities/${activityId}`),
          { headers: this.apiConfig.getAuthHeaders() }
        ).pipe(
          catchError(this.handleError)
        )
      );

      return {
        success: true,
        message: 'Actividad eliminada exitosamente'
      };
    } catch (error: any) {
      console.error('Error al eliminar actividad:', error);
      return {
        success: false,
        message: error.error?.error || 'Error de conexión con el servidor'
      };
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || `Error ${error.status}: ${error.message}`;
    }
    
    console.error('HttpClient Error:', errorMessage);
    return throwError(() => error);
  }

  convertContentToApiFormat(localContent: any[]): ContentItem[] {
    return this.mapper.convertToApiFormat(localContent);
  }

  convertToLocalFormat(activity: ActivityResponse): any {
    return this.mapper.convertToLocalFormat(activity);
  }
}