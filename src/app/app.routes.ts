import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './teacher/home/home';
import { CardsHome } from './components/cards-home/cards-home';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
   },
   {
    path: 'login',
    component: Login
   },
   {
    path: 'register',
    component: Register
   },
   {
    path: 'teacher',
    component: Home,
    children: [
        { path: '', component: CardsHome }
    ]
   },
   {
    path: 'student',
    children: [
        { path: 'student', component: CardsHome }
    ]
   }
];
