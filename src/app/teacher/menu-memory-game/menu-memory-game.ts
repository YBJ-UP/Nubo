import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from '../../components/header/header';
import { MemoryGameService, MemoryGame } from '../../services/utilidades/memory-game.service';

@Component({
  selector: 'app-menu-memory-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-memory-game.html',
  styleUrl: './menu-memory-game.css'
})
export class MenuMemoryGame implements OnInit, OnDestroy {
  games: MemoryGame[] = [];
  private readonly COLOR_PALETTE: string[] = ['#EBE3C0', '#A2D8F2', '#FFC364', '#D0CDEA', '#FFD0A7', '#D6DC82', '#D96073'];
  isTeacherView: boolean = false;
  isDeleting: boolean = false;
  selectedGameIndex: number = -1;

  constructor(
    private router: Router,
    private gameService: MemoryGameService
  ) {
    this.isTeacherView = this.router.url.startsWith('/teacher');
  }

  ngOnInit() {
      this.gameService.getGames().subscribe(games => {
      console.log('Juegos actualizados:', games);
      this.games = games.map((g, idx) => ({
        ...g,
        color: g.color || this.COLOR_PALETTE[idx % this.COLOR_PALETTE.length]
      }));
    });
  }

  ngOnDestroy() {}

  goBack() {
    if (this.isTeacherView) {
      this.router.navigate(['/teacher']);
    } else {
      this.router.navigate(['/student']);
    }
  }

  createGame() {
    const route = this.isTeacherView ? '/teacher/new-memory-game' : '/student/new-memory-game';
    this.router.navigate([route]);
  }

  deleteGame() {
    if (!this.isDeleting) {
      this.isDeleting = true;
      this.selectedGameIndex = -1;
    } else {
      if (this.selectedGameIndex !== -1 && this.selectedGameIndex < this.games.length) {
        console.log('Eliminando juego en índice:', this.selectedGameIndex);
        this.gameService.deleteGame(this.selectedGameIndex);
        this.isDeleting = false;
        this.selectedGameIndex = -1;
      }
    }
  }

  selectGame(index: number) {
    if (this.isDeleting) {
      this.selectedGameIndex = index;
    }
  }

  cancelDelete() {
    this.isDeleting = false;
    this.selectedGameIndex = -1;
  }

  confirmDelete() {
    if (this.selectedGameIndex !== -1 && this.selectedGameIndex < this.games.length) {
      console.log('Eliminando juego en índice:', this.selectedGameIndex);
      this.gameService.deleteGame(this.selectedGameIndex);
      this.isDeleting = false;
      this.selectedGameIndex = -1;
    }
  }

  playGame(index: number) {
    const route = this.isTeacherView ? '/teacher/memory-game' : '/student/memory-game';
    this.router.navigate([route], { queryParams: { index } });
  }

  onGameSaved(newGame: any) {
    const idx = this.games.length;
    newGame.color = newGame.color || this.COLOR_PALETTE[idx % this.COLOR_PALETTE.length];
    this.games.push(newGame);
  }
}
