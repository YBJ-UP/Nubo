import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: false
})
export class Header {
  view = input("Hogar")
  name = input("Usuario")
  role = input("Educador")
  school = input("Escuela")
}
