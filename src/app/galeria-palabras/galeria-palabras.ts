import { Component } from '@angular/core';
import { Sidebar } from "../components/sidebar/sidebar";
import { RouterModule } from '@angular/router';
import { Header } from "../components/header/header";

@Component({
  selector: 'app-galeria-palabras',
  imports: [Sidebar, Header],
  templateUrl: './galeria-palabras.html',
  styleUrl: './galeria-palabras.css'
})
export class GaleriaPalabras {

}
