import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home} from './home/home';
import { CreateStudent } from './create-student/create-student';
const routes: Routes = [
  {
    path:'',
    children:[
      {path: 'home', component: Home},
      {path:'createStudent', component: CreateStudent},
      {path:'', redirectTo: 'home', pathMatch: 'full'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
