import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, NgClass],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  color = input("teacher")
  color1 = input("student")
}