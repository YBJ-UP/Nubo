import { Routes } from '@angular/router';

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
        path:'home',
        loadComponent: () => {
            return import('./home/home').then((m) => m.Home)
        }
    }
];
