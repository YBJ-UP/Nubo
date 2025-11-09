import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MemoryGameService } from '../../services/memory-game.service';
import { Header } from '../../components/header/header';

interface Card {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-memory-game',
  imports: [CommonModule, Header],
  templateUrl: './memory-game.html',
  styleUrl: './memory-game.css'
})
export class MemoryGame implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  moves: number = 0;
  matches: number = 0;
  gameColor: string = '#90CAF9';
  gameTitle: string = '';
  isChecking: boolean = false;
  gameCompleted: boolean = false;
  totalPairs: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: MemoryGameService
  ) {}

  ngOnInit() {
    // Obtener el índice del juego de los parámetros de la ruta
    const gameIndex = this.route.snapshot.queryParams['index'];
    
    if (gameIndex !== undefined) {
      this.gameService.getGames().subscribe(games => {
        const game = games[parseInt(gameIndex)];
        if (game) {
          this.gameTitle = game.title;
          this.gameColor = game.color;
          this.initializeGame(game.cards);
        }
      });
    }
  }

  initializeGame(gameCards: any[]) {
    // Duplicar las cartas para crear pares
    const duplicatedCards = [...gameCards, ...gameCards];
    
    // Mezclar las cartas
    this.cards = this.shuffleArray(duplicatedCards).map((card, index) => ({
      id: index,
      imageUrl: card.imageUrl,
      isFlipped: false,
      isMatched: false
    }));

    this.totalPairs = gameCards.length;
    this.moves = 0;
    this.matches = 0;
    this.gameCompleted = false;
  }

  shuffleArray(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  flipCard(card: Card) {
    // No permitir voltear si ya hay 2 cartas volteadas o si la carta ya está volteada/emparejada
    if (this.isChecking || card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
      return;
    }

    card.isFlipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkForMatch();
    }
  }

  checkForMatch() {
    this.isChecking = true;
    const [card1, card2] = this.flippedCards;

    if (card1.imageUrl === card2.imageUrl) {
      // ¡Es un par!
      card1.isMatched = true;
      card2.isMatched = true;
      this.matches++;
      this.flippedCards = [];
      this.isChecking = false;

      // Verificar si el juego está completo
      if (this.matches === this.totalPairs) {
        this.gameCompleted = true;
      }
    } else {
      // No es un par, voltear de regreso después de un retraso
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isChecking = false;
      }, 1000);
    }
  }

  restartGame() {
    this.cards.forEach(card => {
      card.isFlipped = false;
      card.isMatched = false;
    });
    this.cards = this.shuffleArray(this.cards).map((card, index) => ({
      ...card,
      id: index
    }));
    this.flippedCards = [];
    this.moves = 0;
    this.matches = 0;
    this.gameCompleted = false;
  }

  previousGame() {
    // Navegar al juego anterior si existe
    const currentIndex = parseInt(this.route.snapshot.queryParams['index'] || '0');
    if (currentIndex > 0) {
      const route = this.router.url.startsWith('/teacher') ? '/teacher/memory-game' : '/student/memory-game';
      this.router.navigate([route], { queryParams: { index: currentIndex - 1 } });
    }
  }

  nextGame() {
    // Navegar al siguiente juego si existe
    const currentIndex = parseInt(this.route.snapshot.queryParams['index'] || '0');
    this.gameService.getGames().subscribe(games => {
      if (currentIndex < games.length - 1) {
        const route = this.router.url.startsWith('/teacher') ? '/teacher/memory-game' : '/student/memory-game';
        this.router.navigate([route], { queryParams: { index: currentIndex + 1 } });
      }
    });
  }

  playAudio() {
    // Reproducir audio cuando esté implementado
    console.log('Reproducir audio');
  }

  goBack() {
    const route = this.router.url.startsWith('/teacher') ? '/teacher/menu-memory-game' : '/student/menu-memory-game';
    this.router.navigate([route]);
  }
}
