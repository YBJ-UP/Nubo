import { Component } from '@angular/core';
import { Cloud } from "../components/cloud/cloud";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [Cloud, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
