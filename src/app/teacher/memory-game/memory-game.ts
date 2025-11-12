import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Header } from '../../components/header/header';
import { MemoryGameService } from '../../services/memory-game.service';

interface Card {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
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
  selectedVictoryMessage: string = '';
  selectedMotivationMessage: string = '';
  private victoryMessages: string[] = [
    '¡Excelente trabajo! ¡Lo lograste!',
    '¡Fantástico! Tu memoria está en forma.',
    '¡Muy bien! ¡Sigue así!',
    '¡Lo hiciste de maravilla!',
    '¡Imparable! ¡Gran memoria!',
    '¡Genial! ¡Actividad completada!'
  ];
  private motivationMessages: string[] = [
    'Cada intento te hace más fuerte 💪',
    'Tu constancia es tu superpoder ✨',
    '¡Qué buena concentración! 🔍',
    'Aprender jugando es el mejor camino 🎯',
    '¡Sigue explorando, vas increíble! 🚀',
    'Tu memoria hoy brilló con todo ⭐'
  ];
  private accentColors: string[] = ['#c8b8db', '#b8cde8', '#e5e7eb', '#a5d6a7', '#ffe082'];
  accentColor: string = '#c8b8db';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: MemoryGameService
  ) {}

  ngOnInit() {
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
    const duplicatedCards = [...gameCards, ...gameCards];
    
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
      card1.isMatched = true;
      card2.isMatched = true;
      this.matches++;
      this.flippedCards = [];
      this.isChecking = false;

      if (this.matches === this.totalPairs) {
        this.selectedVictoryMessage = this.getRandomItem(this.victoryMessages);
        this.selectedMotivationMessage = this.getRandomItem(this.motivationMessages);
        this.accentColor = this.getRandomItem(this.accentColors);
        this.gameCompleted = true;
      }
    } else {
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        this.flippedCards = [];
        this.isChecking = false;
      }, 1000);
    }
  }

  private getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
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
    const currentIndex = parseInt(this.route.snapshot.queryParams['index'] || '0');
    if (currentIndex > 0) {
      const route = this.router.url.startsWith('/teacher') ? '/teacher/memory-game' : '/student/memory-game';
      this.router.navigate([route], { queryParams: { index: currentIndex - 1 } });
    }
  }

  nextGame() {
    const currentIndex = parseInt(this.route.snapshot.queryParams['index'] || '0');
    this.gameService.getGames().subscribe(games => {
      if (currentIndex < games.length - 1) {
        const route = this.router.url.startsWith('/teacher') ? '/teacher/memory-game' : '/student/memory-game';
        this.router.navigate([route], { queryParams: { index: currentIndex + 1 } });
      }
    });
  }

  playAudio() {
    console.log('Reproducir audio');
  }

  goBack() {
    const route = this.router.url.startsWith('/teacher') ? '/teacher/menu-memory-game' : '/student/menu-memory-game';
    this.router.navigate([route]);
  }
}
