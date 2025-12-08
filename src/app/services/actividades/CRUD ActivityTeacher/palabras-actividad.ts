import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TeacherAuthService } from '../../authentication/teacher-auth.service';
import { PalabraCompleta } from '../../../interfaces/actividad-completa';
import { ApiConfigService } from '../../utilidades/api-config.service';
import { ActivityResponse } from '../../../interfaces/activity/activity-response';

interface ActivityDTO {
  teacherId: string;
  moduleId: string;
  titulo: string;
  thumbnail: string;
  isPublic: boolean;
  content: ContentItemDTO[];
}

interface ContentItemDTO {
  texto: string;
  imagenUrl: string;
  syllables: string[];
  graphemes: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private apiConfig: ApiConfigService,
    private teacherAuth: TeacherAuthService
  ) { }

  async createActivity(
    titulo: string,
    imagenPortada: string,
    palabrasCompletas: PalabraCompleta[],
    moduleId: string = "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ): Promise<{ success: boolean; message: string }> {

    const teacher = this.teacherAuth.getCurrentTeacher();
    const token = this.teacherAuth.getAuthToken();

    if (!teacher || !token) {
      return { success: false, message: 'No hay sesión de maestro activa.' };
    }

    const requestBody: ActivityDTO = {
      teacherId: teacher.id,
      moduleId: moduleId,
      titulo: titulo,
      thumbnail: imagenPortada,
      isPublic: true,
      content: palabrasCompletas.map(p => ({
        texto: p.palabra,
        imagenUrl: p.imagenUrl,
        syllables: p.syllables.map(s => s.texto),
        graphemes: p.fonemas.map(f => f.texto)
      }))
    };

    console.log("Enviando DTO:", requestBody);
    try {
      const response = await fetch(
        this.apiConfig.getFullUrl(`/teacher/${teacher.id}/activities`),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          message: error.error || error.message || 'Error al guardar la actividad'
        };
      }

      return { success: true, message: 'Actividad creada exitosamente' };

    } catch (error) {
      console.error('Error creando actividad:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }

  }


}