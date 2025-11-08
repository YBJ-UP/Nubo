import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-memory-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-memory-game.html',
  styleUrl: './menu-memory-game.css'
})
export class MenuMemoryGame implements OnInit {
  games: any[] = []; // Aquí almacenaremos los juegos
  isTeacherView: boolean = false;

  constructor(private router: Router) {
    // Determinar si estamos en la vista de maestro o estudiante
    this.isTeacherView = this.router.url.startsWith('/teacher');
  }

  ngOnInit() {
    // Aquí podemos cargar los juegos cuando se inicializa el componente
  }

  goBack() {
    if (this.isTeacherView) {
      this.router.navigate(['/teacher']);
    } else {
      this.router.navigate(['/student']);
    }
  }

  createGame() {
    // Navegar a la vista de nuevo juego
    this.router.navigate(['/teacher/new-memory-game']);
  }

  deleteGame() {
    console.log('Eliminar juego');
    // Aquí irá la lógica para eliminar un juego
  }

  // Método para recibir el nuevo juego cuando se guarda
  onGameSaved(newGame: any) {
    this.games.push(newGame);
  }
}
