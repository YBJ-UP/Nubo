import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
    // Obtener juegos existentes del localStorage
    let savedGames = [];
    const existingGames = localStorage.getItem('memoryGames');
    if (existingGames) {
      savedGames = JSON.parse(existingGames);
    }

    // Crear nuevo juego con título y tarjetas
    const newGame = {
      title: document.querySelector<HTMLInputElement>('.title-input')?.value || 'Sin título',
      cards: this.cards,
      color: this.getRandomColor()
    };
    
    // Agregar el nuevo juego a la lista
    savedGames.push(newGame);
    
    // Guardar en localStorage
    localStorage.setItem('memoryGames', JSON.stringify(savedGames));
    
    console.log('Nuevo juego guardado:', newGame);
    // Navegar de vuelta al menú de juegos
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
  



