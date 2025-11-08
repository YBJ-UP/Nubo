import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    // Aquí irá la lógica para guardar el juego de memoria
    console.log('Guardando juego de memoria...');
    // Por ahora solo mostraremos un console.log, pero aquí se implementará
    // la lógica real de guardado cuando se necesite
  }

  cancelMemoryGame() {
    // Aquí irá la lógica para cancelar la creación del juego
    console.log('Cancelando creación del juego de memoria...');
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
  



