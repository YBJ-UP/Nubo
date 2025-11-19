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
import { CardsPalabras } from './components/cards-palabras/cards-palabras';
import { MenuMemoryGame } from './teacher/menu-memory-game/menu-memory-game';
import { NewMemoryGame } from './teacher/new-memory-game/new-memory-game';
import { MemoryGame } from './teacher/memory-game/memory-game';
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
        { path: 'menu-memory-game', component: MenuMemoryGame },
        { path: 'new-memory-game', component: NewMemoryGame },
        { path: 'students', component: CreateStudent, children: [ { path: '', component: ViewStudent }, { path: 'new', component: NewStudent } ] },
        { path: 'cognitive-abilities', component: GaleriaPalabras }
    ]
   },
   {
    path: 'teacher/memory-game',
    component: MemoryGame
   },
   {
    path: 'student',
    component: StudentHome,
    children: [
        { path: '', component: CardsHome },
        { path: 'menu-memory-game', component: MenuMemoryGame },
        {
            path: 'students',
            component: CreateStudent,
            children: [
                { path: '', component: ViewStudent },
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
        {
            path:'juego-ludico',
            component: ludicshell,
            children:[
              { path: '', component: GaleriaJuegos },
              { path: 'memorama/:id', component: Memorama }
            ]
        },
        { path: 'crear-actividad', component: CrearActividadComponent }
    ]
   },
   {
    path: 'student/memory-game',
    component: MemoryGame
   }
];