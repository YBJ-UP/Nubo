import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Register } from './register/register';
import { RouterLink } from "@angular/router";
@NgModule({
  declarations: [Login, Register],
  imports: [
    CommonModule,
    SharedModule,
    RouterLink,
    FormsModule
]
})
export class AuthModule {  }
