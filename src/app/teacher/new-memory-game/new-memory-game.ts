import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemoryGameService, MemoryGame } from '../../services/memory-game.service';

interface MemoryCard {
  imageUrl: string;
  word: string;
  file?: File;
}

@Component({
  selector: 'app-new-memory-game',
  templateUrl: './new-memory-game.html',
  styleUrl: './new-memory-game.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NewMemoryGame {
  MAX_CARDS = 6;
  cards: MemoryCard[] = [];
  currentCardCount = 0;
  showMaxCardsModal = false;
  showInstructions = true; // Mostrar instrucciones por defecto

  constructor(
    private router: Router,
    private gameService: MemoryGameService
  ) {}

  triggerFileInput() {
    if (this.cards.length >= this.MAX_CARDS) {
      this.showMaxCardsModal = true;
      return;
    }
    document.getElementById('imageUpload')?.click();
  }

  closeMaxCardsModal() {
    this.showMaxCardsModal = false;
  }

  toggleInstructions() {
    this.showInstructions = !this.showInstructions;
  }

  saveMemoryGame() {
    if (this.cards.length === 0) {
      console.error('No hay tarjetas para guardar');
      return;
    }

    const titleInput = document.querySelector<HTMLInputElement>('.title-input');
    const title = titleInput?.value?.trim() || 'Sin título';

    const newGame: MemoryGame = {
      title: title,
      cards: [...this.cards],
      color: this.getRandomColor()
    };
    
    this.gameService.addGame(newGame);
    this.router.navigate(['/teacher/menu-memory-game']);
  }

  private getRandomColor(): string {
    const colors = ['#EF9A9A', '#90CAF9', '#FFE082', '#A5D6A7', '#CE93D8', '#80DEEA'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  cancelMemoryGame() {
    this.router.navigate(['/teacher/menu-memory-game']);
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) {
      input.value = '';
      return;
    }

    let added = 0;
    const remainingSlots = this.MAX_CARDS - this.cards.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.cards.push({ imageUrl, word: '', file });
        this.currentCardCount = this.cards.length;
      };
      reader.readAsDataURL(file);
      added++;
    });

    if (files.length > remainingSlots) {
      this.showMaxCardsModal = true;
    }

    input.value = '';
  }

  deleteCard(cardToDelete: MemoryCard) {
    const index = this.cards.indexOf(cardToDelete);
    if (index > -1) {
      this.cards.splice(index, 1);
      this.currentCardCount = this.cards.length;
    }
  }

}
  



