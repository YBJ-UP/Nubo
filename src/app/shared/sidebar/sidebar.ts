import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  standalone: false
})
export class Sidebar {
  color = input("teacher")
}