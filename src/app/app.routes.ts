import { Routes } from '@angular/router';

//INICIO DE SESIÓN Y REGISTRO
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

//MAESTRO
import { Home } from './teacher/home/home';
import { CreateStudent } from './teacher/create-student/create-student';

//ESTUDIANTE
import { StudentHome } from './student/home/student-home';
import { ActividadPalabras } from './student/actividad-palabras/actividad-palabras';
import { GaleriaPalabras } from './student/galeria-palabras/galeria-palabras';

//COMPARTIDOS
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
        { path: 'students', component: CreateStudent },
        { path: 'cognitive-abilities', component: GaleriaPalabras }
    ]
   },
   {
    path: 'student',
    component: StudentHome,
    children: [
        { path: '', component: CardsHome },
        { path: 'cognitive-abilities', component: GaleriaPalabras }
    ]
   }
];
