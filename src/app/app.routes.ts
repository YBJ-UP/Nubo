import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';

import { Home } from './teacher/home/home';
import { CreateStudent } from './teacher/create-student/create-student';

import { StudentHome } from './student/home/student-home';
import { ActividadPalabras } from './student/actividad-palabras/actividad-palabras';
import { GaleriaPalabras } from './student/galeria-palabras/galeria-palabras';


import { CardsHome } from './components/cards-home/cards-home';
import { CardsPalabras } from './components/cards-palabras/cards-palabras';

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
        { path: '', component: CardsHome },
        { path: 'students', component: CreateStudent }
    ]
   },
   {
    path: 'student',
    component: StudentHome,
    children: [
        { path: '', component: CardsHome }
    ]
   }
];
