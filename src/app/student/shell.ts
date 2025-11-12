import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from '../components/header/header';
import { Sidebar } from '../components/sidebar/sidebar';

@Component({
  selector: 'app-cognitive-abilities-shell',
  imports: [CommonModule, RouterOutlet, Header, Sidebar],
  template: `
    <div class="shell-container">
      <app-sidebar />
      <div class="shell-content">
        <app-header 
          [view]="'Actividades Cognitivas'"
          [name]="'Yael Betanzos Jiménez'" 
          [role]="'Estudiante'" 
          [school]="'UP Chiapas'" 
        />
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .shell-container {
      display: grid;
      grid-template-columns: auto 1fr;
      width: 100vw;
      height: 100vh;
      background-color: #FFF9F2;
      overflow: hidden;
    }
    
    .shell-content {
      display: flex;
      flex-direction: column;
      max-width: 100%;
      height: 100vh;
      overflow: hidden;
    }
  `],
  standalone: true
})
export class Shell { }