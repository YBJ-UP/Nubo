import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterLayout } from './master-layout/master-layout';
import { StudentLayout } from './student-layout/student-layout';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared-module';
@NgModule({
  declarations: [
    MasterLayout, StudentLayout,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    SharedModule
],
  exports:[
    MasterLayout, StudentLayout
  ]
})
export class LayoutModule { }
