
import { Login } from './auth/login/login';
import { Register} from './auth/register/register';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {path:'login', component:Login},
    {path:'register', component: Register},
    {
        path:'teacher',
        loadChildren: () => import('./teacher/teacher-routing-module').then(m => m.TeacherRoutingModule)
    },
    {
        path:'student',
        loadChildren: () => import('./student/student-routing-module').then(m=> m.StudentRoutingModule)
    }
];
