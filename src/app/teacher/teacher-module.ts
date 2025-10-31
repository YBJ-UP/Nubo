import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { Home} from './home/home';
import { CreateStudent } from './create-student/create-student';
@NgModule({
  declarations: [Home,CreateStudent ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class TeacherModule { }
