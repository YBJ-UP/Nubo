import { Component} from '@angular/core';
import { Student } from '../../interfaces/student';
import studentData from '../../../../public/placeholderData/studentData.json'

@Component({
  selector: 'app-create-student',
  imports: [],
  templateUrl: './create-student.html',
  styleUrl: './create-student.css'
})

export class CreateStudent {
  inputTextFields: string[] = ['','','']
  inputText: string = ''

  addValue(inputValue : string, field: number){
    this.inputTextFields[field] = inputValue
    if (this.inputTextFields[0] || this.inputTextFields[1] || this.inputTextFields[2]){
      this.inputText = this.inputTextFields.join(' ')
    }else{
      this.inputText = ''
    }
  }
}
