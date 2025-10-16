import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-type',
  imports: [RouterLink],
  templateUrl: './login-type.html',
  styleUrl: './login-type.css'
})
export class LoginType {
  selection = input("teacher")
}
