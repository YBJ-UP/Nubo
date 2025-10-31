import { Component, input } from '@angular/core';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.html',
  styleUrl: './greeting.css',
  standalone: false
})
export class Greeting {
  name = input("Usuario")
}
