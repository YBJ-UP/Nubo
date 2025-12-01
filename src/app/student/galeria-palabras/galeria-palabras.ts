import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ActividadFormService } from '../../services/actividades/actividad.service';
import { FloatingMessage } from '../../shared/floating-message/floating-message';
import { StudentActivityService } from '../../services/actividades/student-activity.service';

@Component({
  selector: 'app-galeria-palabras',
  imports: [CommonModule, RouterModule, FloatingMessage],
  templateUrl: './galeria-palabras.html',
  styleUrls: ['./galeria-palabras.css']
})
export class GaleriaPalabras {}