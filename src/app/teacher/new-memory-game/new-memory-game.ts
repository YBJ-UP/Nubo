import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MemoryGame } from '../../interfaces/activity/memory-game';
import { MemoryGameService } from '../../services/utilidades/memory-game.service';
import { TeacherAuthService } from '../../services/authentication/teacher-auth.service';

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
  

  constructor(
    private router: Router,
    private gameService: MemoryGameService,
    private teacher: TeacherAuthService
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

  async saveMemoryGame() {
    if (this.cards.length === 0) {
      console.error('No hay tarjetas para guardar');
      return;
    }

    // Validar que tengamos los IDs necesarios
    const teacherId = this.teacher.currentTeacher?.id;
    
    if (!teacherId) {
      console.error('Falta información del profesor');
      return;
    }

    const titleInput = document.querySelector<HTMLInputElement>('.title-input');
    const title = titleInput?.value?.trim() || 'Sin título';

    // 7. Mapear tus 'cards' locales al formato que el servicio pueda entender.
    // El componente usa 'word', pero si el servicio espera 'texto', hacemos el cambio aquí.
    const mappedCards = this.cards.map(c => ({
      texto: c.word,      // Mapeamos word -> texto
      imagenUrl: c.imageUrl,
      // file: c.file // El servicio no usa el archivo raw, solo la URL (base64 o http)
    }));

    const newGame: MemoryGame = {
      title: title,
      cards: mappedCards, 
      color: this.getRandomColor()
    };
    
    // 8. Llamar al servicio
    // Pasamos el objeto, el moduleId y el teacherId
    const success = await this.gameService.createGame(newGame, teacherId);

    if (success) {
      // Opcional: Actualizar el estado local solo si la BD respondió bien
      this.gameService.addGame(newGame); 
      
      console.log('Juego guardado exitosamente');
      const route = this.router.url.startsWith('/teacher') ? '/teacher/menu-memory-game' : '/student/menu-memory-game';
      this.router.navigate([route]);
    } else {
      console.error('Error al guardar el juego en el servidor');
      // Manejar el error visualmente (ej. un toast o alerta)
    }
  }

  private getRandomColor(): string {
    const colors = ['#EF9A9A', '#90CAF9', '#FFE082', '#A5D6A7', '#CE93D8', '#80DEEA'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  cancelMemoryGame() {
    const route = this.router.url.startsWith('/teacher') ? '/teacher/menu-memory-game' : '/student/menu-memory-game';
    this.router.navigate([route]);
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
  



