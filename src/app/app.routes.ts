import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'register',
        loadComponent: () => {
            return import('./register/register').then((m) => m.Register)
        }
    },
    {
        path:'login',
        loadComponent: () => {
            return import('./login/login').then((m) => m.Login)
        }
    },
    {
        path:'home',
        loadComponent: () => {
            return import('./home/home').then((m) => m.Home)
        }
    }
];
