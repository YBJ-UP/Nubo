import { Component} from '@angular/core';
import studentData from '../../../../public/placeholderData/studentData.json'
import { FormsModule, NgForm } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Student } from '../../interfaces/student';

@Component({
  selector: 'app-create-student',
  imports: [FormsModule, RouterModule],
  templateUrl: './create-student.html',
  styleUrl: './create-student.css'
})

export class CreateStudent {
  data: Student[] = studentData
}
