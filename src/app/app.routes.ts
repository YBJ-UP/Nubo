import { Routes } from '@angular/router';

//INICIO DE SESIÓN Y REGISTRO
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

//MAESTRO
import { Home } from './teacher/home/home';
import { CreateStudent } from './teacher/create-student/create-student';
import { NewStudent } from './teacher/new-student/new-student';
import { ViewStudent } from './teacher/view-student/view-student';
import { CrearActividadComponent } from './teacher/crear-actividad/crear-actividad';

//ESTUDIANTE
import { StudentHome } from './student/home/student-home';
import { ActividadPalabras } from './student/actividad-palabras/actividad-palabras';
import { GaleriaPalabras } from './student/galeria-palabras/galeria-palabras';
import { GaleriaJuegos } from './student/galeria-juegos/galeria-juegos';

//COMPARTIDOS
import { CardsHome } from './components/cards-home/cards-home';
import { Shell } from './student/shell';
import { ludicshell } from './student/ludic-shell';
import { Memorama } from './components/cardGameMemorama/memorama';

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
        { 
            path: 'students', 
            component: CreateStudent,
            children: [
                { path: 'new', component: NewStudent },
                { path: 'view/:id', component: ViewStudent }
            ]
        },
        { 
            path: 'cognitive-abilities', 
            component: Shell,
            children: [
                { path: '', component: GaleriaPalabras },
                { path: 'actividad/:id', component: ActividadPalabras }
            ]
        },
        { path: 'crear-actividad', component: CrearActividadComponent }
    ]
   },
   {
       path: 'student',
    component: StudentHome,
    children: [
        { path: '', component: CardsHome },
        { 
            path: 'cognitive-abilities', 
            component: Shell, 
            children: [
                { path: '', component: GaleriaPalabras },
                { path: 'actividad/:id', component: ActividadPalabras}
            ]
        },
        {
            path:'juego-ludico', 
            component: ludicshell,
            children:[
              {path: '', component: GaleriaJuegos},
              {path: 'memorama/:id', component: Memorama}
            ]
        }
    ]
   }
];