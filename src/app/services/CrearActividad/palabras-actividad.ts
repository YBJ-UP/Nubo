


import { Injectable } from '@angular/core';
import { ApiConfigService } from '../utilidades/api-config.service';
import { TeacherAuthService } from '../authentication/teacher-auth.service';
import { PalabraCompleta } from '../actividades/actividad.service';

interface ActivityDTO {
  teacherId: string;
  moduleId: string;      
  title: string;         
  thumbnail: string;     
  isPublic: boolean;     
  content: ContentItemDTO[];
}

interface ContentItemDTO {
  texto: string;         
  imagenUrl: string;
  silabas: string[];
  grafemas: string[];   
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private apiConfig: ApiConfigService,
    private teacherAuth: TeacherAuthService
  ) {}

  async createActivity(
    titulo: string, 
    imagenPortada: string, 
    palabrasCompletas: PalabraCompleta[],
    moduleId: string = "3fa85f64-5717-4562-b3fc-2c963f66afa6" // ID TEMPORAL O POR DEFECTO
  ): Promise<{ success: boolean; message: string }> {

    const teacher = this.teacherAuth.getCurrentTeacher();
    const token = this.teacherAuth.getAuthToken();

    if (!teacher || !token) {
      return { success: false, message: 'No hay sesión de maestro activa.' };
    }

    const requestBody: ActivityDTO = {
      teacherId: teacher.id,
      moduleId: moduleId, 
      title: titulo,
      thumbnail: imagenPortada,
      isPublic: true, 
      content: palabrasCompletas.map(p => ({
        texto: p.palabra,     
        imagenUrl: p.imagenUrl,
        silabas: p.silabas.map(s => s.texto), 
        grafemas: p.fonemas.map(f => f.texto) 
      }))
    };

    console.log("Enviando DTO:", requestBody);
    try {
      const response = await fetch(
        this.apiConfig.getEndpoint(`/teacher/${teacher.id}/activities`),
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