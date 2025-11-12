// src/app/student/shell.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';

@Component({
  selector: 'app-cognitive-abilities-shell',
  imports: [CommonModule, RouterOutlet, Header],
  template: `
    <div class="shell-container">
      <app-header 
        [view]="'Actividades Cognitivas'"
        [name]="'Yael Betanzos Jiménez'" 
        [role]="'Estudiante'" 
        [school]="'UP Chiapas'" 
      />
      <div class="shell-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .shell-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      background-color: #FFF9F2;
      overflow: hidden;
    }
    
    .shell-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px 40px;
    }
  `],
  standalone: true
})
export class Shell { }