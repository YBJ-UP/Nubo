import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cognitive-abilities-shell',
  imports: [CommonModule, RouterOutlet], 
  template: '<router-outlet></router-outlet>', 
  standalone: true 
})
export class Shell { }