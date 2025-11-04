import { Component } from '@angular/core';
import { Card } from '../../interfaces/card';

@Component({
  selector: 'app-new-memory-game',
  imports: [],
  templateUrl: './new-memory-game.html',
  styleUrl: './new-memory-game.css'
})
export class NewMemoryGame {
  // --- 2. Constantes y Estado ---
  MAX_CARDS = 5;
  cards: Card[] = [];

  // --- 3. Seleccionadores del DOM (Corregidos) ---
  cardRow = document.querySelector<HTMLElement>('.cards-row')!;
  addButtonWrapper = document.getElementById('add-card-wrapper')!;
  addButton: HTMLElement | null = this.addButtonWrapper?.querySelector('.add-card');
  cardBadge = this.addButtonWrapper?.querySelector('.card-badge');

  renderCards() {
  if (!this.cardRow || !this.addButtonWrapper) {
    console.error("Error: No se encontraron .cards-row o #add-card-wrapper");
    return;
  }

  const existingCards = this.cardRow.querySelectorAll('.card-item-wrapper:not(#add-card-wrapper)');
  existingCards.forEach(card => card.remove());

  this.cards.forEach((card, index) => {
    const cardHtml = `
      <div class="card-item-wrapper">
        <div class="card-item image-card">
          <button class="delete-btn" data-index="${index}">×</button>
          <img src="${card.imageUrl}" alt="${card.name}">
        </div>
        <div class="card-label">${card.name}</div>
      </div>
    `;
    
    this.addButtonWrapper.insertAdjacentHTML('beforebegin', cardHtml);
  });
  }

  updateBadgeAndButton() {
  if (!this.cardBadge || !this.addButton) return;

  this.cardBadge.textContent = `${this.cards.length}/${this.MAX_CARDS}`;

  if (this.cards.length >= this.MAX_CARDS) {
    this.addButton.classList.add('disabled');
  } else {
    this.addButton.classList.remove('disabled');
  }
  }

  addCard() {
  if (this.cards.length >= this.MAX_CARDS) {
    alert("¡Límite alcanzado! No puedes agregar más de 5 cartas.");
    return;
  }

  const imageUrl = prompt("Por favor, pega la URL de la imagen:");
  if (!imageUrl) return; 

  const name = prompt("¿Qué nombre le pones a la carta?");
  if (!name) return;

  this.cards.push({ imageUrl, name });
  this.renderCards();
  }

  handleCardRowClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains('delete-btn')) {
    const indexAttr = target.getAttribute('data-index');
    if (indexAttr === null) return; 

    const index = parseInt(indexAttr, 10);
    this.cards.splice(index, 1);
    this.renderCards();
  }
  }

}
  



