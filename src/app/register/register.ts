import { Component } from '@angular/core';
import { Cloud } from "../components/cloud/cloud";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [Cloud, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

}
