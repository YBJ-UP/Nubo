import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { MemoryGame } from '../../interfaces/activity/memory-game';

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  private games: MemoryGame[] = [];
  private gamesSubject = new BehaviorSubject<MemoryGame[]>([]);

  constructor(private api: ApiConfigService ) {
    console.log('MemoryGameService iniciado');
  }

  async getGames(): Promise<{ succes: boolean, message: string, games?: MemoryGame[] }> {
    console.log('Obteniendo juegos...');
    try{
      const response = await fetch( this.api.getFullUrl('/activities') )

      if (!response.ok){
        const error = await response.json()
        return {
          succes: false,
          message: error,
          games: []
        }
      }

      const games = await response.json()
      console.log('Respuesta:')
      console.log(games)

      return {
        succes: true,
        message: 'Memoramas conseguidos con éxito',
        games: games
      }

    }catch(e){
      return{
        succes: false,
        message: `Error al traer los memoramas: ${e}`,
        games: []
      }
    }
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