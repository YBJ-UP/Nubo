import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-type',
  templateUrl: './login-type.html',
  styleUrl: './login-type.css',
  standalone: false
})
export class LoginType {
  selection = input("teacher")
}
