import { Routes } from '@angular/router';
import { Home } from './teacher/home/home';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'register',
        pathMatch:'full'
    },
    {
        path:'register',
        loadComponent: () => {
            return import('./register/register').then((m) => m.Register)
        }
    },
    {
        path:'login/teacher',
        loadComponent: () => {
            return import('./login/login').then((m) => m.Login)
        }
    },
    {
        path:'login/student',
        loadComponent: () => {
            return import('./login/students/students').then((m) => m.Students)
        }
    },
    {
        path:'home/teacher',
        loadComponent: () => {
            return import('./teacher/home/home').then((m) => m.Home)
        }
    },
    {
        path:'home/student',
        loadComponent: () => {
            return import('./student/home/student-home').then((m) => m.StudentHome)
        }
    },
    {
        path:'home/teacher/students',
        loadComponent: () => {
            return import('./teacher/create-student/create-student').then((m) => m.CreateStudent)
        }
    },
    {
        path:'cognitive-abilities',
        loadComponent: () => {
            return import('./student/galeria-palabras/galeria-palabras').then((m) => m.GaleriaPalabras)
        }
    },
    {
        path:'actividad/:id',
        loadComponent:()=>{
            return import('./student/actividad-palabras/actividad-palabras').then((m)=> m.ActividadPalabras)
        }
    },
    {
        path:'teacher',
        component: Home
    }
];
