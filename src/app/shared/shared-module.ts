import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from './header/header';
import { Sidebar } from './sidebar/sidebar';
import { Greeting } from './greeting/greeting';
import { CardsHome } from './cards-home/cards-home';
import { CardsPalabras } from './cards-palabras/cards-palabras';
import { Nube } from './nube/nube';
import { Cloud } from './cloud/cloud';
import { LoginType } from './login-type/login-type';

@NgModule({
  declarations: [ Header, Sidebar, Greeting,
     CardsHome, CardsPalabras, Nube, Cloud,LoginType],
  imports: [ CommonModule ],
  exports: [ Header, Sidebar, Greeting,
     CardsHome, CardsPalabras, Nube, Cloud,LoginType]
})
export class SharedModule {}
