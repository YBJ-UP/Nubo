import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { FormsModule } from '@angular/forms';
import { Login } from './login/login';
import { Register } from './register/register';
import { Students } from './login/students/students';
@NgModule({
  declarations: [Login, Register,Students],
  imports: [
    FormsModule,
    CommonModule, 
    SharedModule
  ]
})
export class AuthModule { }
