import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actividad-palabras',
  imports: [RouterLink],
  templateUrl: './actividad-palabras.html',
  styleUrl: './actividad-palabras.css'
})
export class ActividadPalabras implements OnInit {
  actividadId: string | null = null;
  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.actividadId = this.route.snapshot.paramMap.get('id');
    console.log(`Cargando actividad con ID: ${this.actividadId}`);
  }
  regresar(): void {
    this.location.back();
  }

}
