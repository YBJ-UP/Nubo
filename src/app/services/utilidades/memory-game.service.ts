import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface MemoryGame {
  title: string;
  cards: any[];
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  private games: MemoryGame[] = [];
  private gamesSubject = new BehaviorSubject<MemoryGame[]>([]);

  constructor() {
    console.log('MemoryGameService iniciado');
  }

  getGames() {
    console.log('Obteniendo juegos:', this.games);
    return this.gamesSubject.asObservable();
  }

  addGame(game: MemoryGame) {
    console.log('Agregando nuevo juego:', game);
    this.games.push(game);
    this.gamesSubject.next([...this.games]);
    console.log('Juegos actualizados:', this.games);
  }

  deleteGame(index: number) {
    this.games.splice(index, 1);
    this.gamesSubject.next([...this.games]);
  }

  clearGames() {
    this.games = [];
    this.gamesSubject.next([]);
  }
}