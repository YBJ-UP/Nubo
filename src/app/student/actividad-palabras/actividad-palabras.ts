import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-actividad-palabras',
  templateUrl: './actividad-palabras.html',
  styleUrl: './actividad-palabras.css',
  standalone: false
})
export class ActividadPalabras implements OnInit {
  actividadId: string | null = null;
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.actividadId = this.route.snapshot.paramMap.get('id');
    console.log(`Cargando actividad con ID: ${this.actividadId}`);
  }

}
