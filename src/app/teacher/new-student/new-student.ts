import { Component } from '@angular/core';
import { Student } from '../../interfaces/student';
import { FormsModule, NgForm } from '@angular/forms';
import studentData from '../../../../public/placeholderData/studentData.json'
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-new-student',
  imports: [FormsModule, RouterLink],
  templateUrl: './new-student.html',
  styleUrl: './new-student.css'
})

export class NewStudent {
  inputTextFields: string[] = ['','','']
  inputText: string = ''
  data: Student[] = studentData
  

  addValue(inputValue : string, field: number){
    this.inputTextFields[field] = inputValue
    if (this.inputTextFields[0] || this.inputTextFields[1] || this.inputTextFields[2]){
      this.inputText = this.inputTextFields.join(' ')
    }else{
      this.inputText = ''
    }
  }

  ngOnInit(){
    for (var i=0 ; i<this.inputTextFields.length ; i++){
      this.inputTextFields[i] = ''
    }
  }

  submit(form: NgForm):void {
    console.log(form.value)
  }

}
