import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiConfigService } from './api-config.service';
import { MemoryGame } from '../../interfaces/activity/memory-game';
import { ActivityResponse } from '../../interfaces/activity/activity-response';
import { CreateActivityRequest } from '../../interfaces/activity/create-activity-request';

@Injectable({
  providedIn: 'root'
})
export class MemoryGameService {
  private games: MemoryGame[] = [];
  private gamesSubject = new BehaviorSubject<MemoryGame[]>([]);

  constructor(private api: ApiConfigService ) {
    console.log('MemoryGameService iniciado');
  }

  async getGames(): Promise<{ succes: boolean, message: string, memoryGames?: MemoryGame[] }> {
    console.log('Obteniendo juegos...');
    try{
      const response = await fetch( this.api.getFullUrl('/activities') )

      if (!response.ok){
        const error = await response.json()
        return {
          succes: false,
          message: error,
          memoryGames: []
        }
      }

      const mGames: ActivityResponse[] = await response.json()

      const games: MemoryGame[] = mGames
        .filter(activity => activity.moduleId == '6297d1fa-a65f-43cd-8070-5960bd89215b')
        .map(activity => {
          
          const cards = activity.content.map(contentItem => ({
            imagenUrl: contentItem.imagenUrl,
            texto: contentItem.texto
          }));

          return {
            title: activity.titulo,
            cards: cards,
            color: '#FFFFFF'
          } as MemoryGame;
        });

      console.log('Respuesta:')
      console.log(games)

      return {
        succes: true,
        message: 'Memoramas conseguidos con éxito',
        memoryGames: games
      }

    }catch(e){
      return{
        succes: false,
        message: `Error al traer los memoramas: ${e}`,
        memoryGames: []
      }
    }
  }

  async createGame(game: MemoryGame, teacherId: string): Promise<{ success: boolean, message: string }>{
    const moduleId = '6297d1fa-a65f-43cd-8070-5960bd89215b'

    const activity: CreateActivityRequest = {
      teacherId: teacherId,
      moduleId: moduleId,
      title: game.title,
      thumbnail: game.cards[0].imagenUrl,
      isPublic: true,
      content: game.cards.map(card => ({ texto:card.texto, imagenUrl: card.imagenUrl, syllables:[], graphemes:[] }))
    }

    try {
      const response = await fetch(this.api.getFullUrl(`/teacher/${teacherId}/activities`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(activity)})

      if (!response.ok){
        const error = await response.json()
        return {
          success: false,
          message: error
        }
      }

      return{
        success: true,
        message: "Actividad creada con éxito"
      }

    } catch (error) {
      return {
        success: false,
        message: `Error al crear la actividad: ${error}`
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