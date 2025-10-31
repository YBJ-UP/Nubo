import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { StudentHome } from './home-student/student-home';
import { GaleriaPalabras} from './galeria-palabras/galeria-palabras';
import { ActividadPalabras } from './actividad-palabras/actividad-palabras';

@NgModule({
  declarations: [StudentHome, GaleriaPalabras,ActividadPalabras],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class StudentModule { }
