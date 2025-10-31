import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentHome } from './home-student/student-home';
import { GaleriaPalabras } from './galeria-palabras/galeria-palabras';
import { ActividadPalabras } from './actividad-palabras/actividad-palabras';
const routes: Routes = [
  {path: '',
  children:[
    {path:'homeStudent', component: StudentHome},
    {path:'palabras', component:GaleriaPalabras},
    {path:'actividad/:activityId', component:ActividadPalabras},
    {path:'', redirectTo:'homeStudent', pathMatch:'full'}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { 

}
