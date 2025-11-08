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
  MAX_CARDS = 5;
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
      cards: [...this.cards], // Crear una copia del array de tarjetas
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
    // Navegar de vuelta al menú sin guardar
    this.router.navigate(['/teacher/menu-memory-game']);
    // Por ahora solo mostraremos un console.log, pero aquí se implementará
    // la lógica de cancelación cuando se necesite
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.cards.push({
          imageUrl,
          word: '',
          file
        });
        this.currentCardCount = this.cards.length;
      };
      reader.readAsDataURL(file);
    }
    // Reset input value to allow selecting the same file again
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
  



