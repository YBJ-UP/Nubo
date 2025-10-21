import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  view = input("Hogar")
  name = input("Usuario")
  role = input("Educador")
  school = input("Escuela")
}
