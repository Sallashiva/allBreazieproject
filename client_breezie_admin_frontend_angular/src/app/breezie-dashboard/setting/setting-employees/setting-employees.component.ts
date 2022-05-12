import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingEmployeesService } from 'src/app/services/setting-employees.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-setting-employees',
  templateUrl: './setting-employees.component.html',
  styleUrls: ['./setting-employees.component.css']
})
export class SettingEmployeesComponent implements OnInit {
  selected = '2';
  text: boolean = false;
  field: boolean = false;
  message: boolean = false;
  questionButtons: boolean = false;
  spinner: boolean = true;
  yesNoQuestion: boolean = false;
  settingEmployeeForm: FormGroup;
  constructor(private fb: FormBuilder,
    private SettingEmployeeService: SettingEmployeesService,
    private welcomeScree: WelcomeScreenService,
    private toastr: ToastrService) {
    this.addText = [],
      this.addMessages = [];
    this.addQuestionText = [];
    this.addyesnoQuestion = [];
  }

  ngOnInit(): void {
    this.settingEmployeeForm = this.fb.group({
      allowEmployee: [false],
      showField: [false],
      automaticallySignOut: [false],
      selected: [false],
      requestSignout: [false],
      fieldName: ["",[Validators.required,Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]],
      addmessages: ["",[Validators.required,Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/)]],
      question: [""],
      yesnoquestion: ["", Validators.required],
      yes: ["", Validators.required],
      no: ["", Validators.required],
      requiredtext: [''],
      requiredyes: ['']
    })

    this.getSettings()
  }
  get fieldNames(){
    return this.settingEmployeeForm.get('fieldName');
  }
  get addmessages(){
    return this.settingEmployeeForm.get('addmessages');
  }
  addField() {
    this.field = !this.field;
    this.message = false;
  }
  addMessage() {
    this.message = !this.message;
    this.field = false;
  }
  addQuestion() {
    this.questionButtons = !this.questionButtons;
    this.message = false;
    this.field = false;
  }
  textField() {
    this.text = !this.text;
    this.questionButtons = false;
    this.message = false;
    this.field = false;
  }

  question() {
    this.yesNoQuestion = !this.yesNoQuestion;
    this.text = false;
    this.questionButtons = false;
  }

  addText: Array < any > ;
  addTextFields(input, addtext) {
    if (addtext !== null) {
      let text = {
        label: addtext,
        fieldType: 'text',
      }
      this.addText.push(text)
    }
    input.value = '';
    this.field = false
    this.settingEmployeeForm.get('fieldName').reset()
  }

  deleteAddText(addtext) {
    const index = this.addText.indexOf(addtext);
    if (index >= 0) this.addText.splice(index, 1);
  }



  addMessages: Array < any > ;
  addMessageText(input, addmessage) {
    if (addmessage !== null) {
      let message = {
        label: addmessage,
        fieldType: 'text',
      }
      this.addMessages.push(message)
    }
    input.value = '';
    this.message = false
    this.settingEmployeeForm.get('addmessages').reset();
  }

  deleteAddMessage(addMessage) {
    const index = this.addMessages.indexOf(addMessage);
    if (index >= 0) this.addMessages.splice(index, 1);
  }






  addQuestionText: Array < any > ;
  addtextQuestion(input, addtextquestion, required) {

    if (addtextquestion !== null) {
      let textQuestion = {
        label: addtextquestion,
        fieldType: 'text',
        require: required._checked,
      }
      if (required._checked._checked === true) {
        textQuestion.require = required._checked;

        this.addQuestionText.push(textQuestion)
      } else {
        this.addQuestionText.push(textQuestion)
      }
      input.value = '';
    }
    input.value = '';
    this.text = false
    this.settingEmployeeForm.get('question').reset();
  }

  deletetextQuestion(addtextquestion) {
    const index = this.addQuestionText.indexOf(addtextquestion);
    if (index >= 0) this.addQuestionText.splice(index, 1);
  }



  addyesnoQuestion: Array < any > ;
  addyesQuestion(input, addtextField, requiredcheck, yes, no) {
    if (addtextField !== null) {
      let phoneText = {
        label: addtextField,
        fieldType: 'text',
        requiredChecked: requiredcheck._checked,
        yesChecked: yes._checked,
        noChecked: no._checked
      }
      if (requiredcheck._checked === true || yes._checked === true || no._checked === true) {
        phoneText.requiredChecked = requiredcheck._checked
        phoneText.yesChecked = yes._checked
        phoneText.noChecked = no._checked
        this.addyesnoQuestion.push(phoneText)
      } else {
        this.addyesnoQuestion.push(phoneText)
      }

      input.value = '';
      this.yesNoQuestion = false;
    }

    this.settingEmployeeForm.get('yesnoquestion').reset();
  }

  deleteyesnofield(remove) {
    const index = this.addyesnoQuestion.indexOf(remove);
    if (index >= 0) this.addyesnoQuestion.splice(index, 1);
  }


  // allowEmployee,
  // showField,
  // automaticallySignOut,
  // requestSignout,

  getSettings() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.spinner = false;
      this.settingEmployeeForm.get('allowEmployee').setValue(res.settings[0].EmployeeSetting.allowEmployee)
      this.settingEmployeeForm.get('showField').setValue(res.settings[0].EmployeeSetting.showField)
      this.settingEmployeeForm.get('automaticallySignOut').setValue(res.settings[0].EmployeeSetting.automaticallySignOut)
      this.settingEmployeeForm.get('requestSignout').setValue(res.settings[0].EmployeeSetting.requestSignout)
      this.settingEmployeeForm.get('selected').setValue(res.settings[0].EmployeeSetting.selected)
      this.addText = res.settings[0].EmployeeSetting.employeeFields
      this.addMessages = res.settings[0].EmployeeSetting.signOutMessages
      this.addQuestionText = res.settings[0].EmployeeSetting.employeeQuestionsText
      this.addyesnoQuestion = res.settings[0].EmployeeSetting.employeeQuestionsRadio
    })
  }


  submit() {
    this.spinner = true;


    let data = {
      allowEmployee: this.settingEmployeeForm.value.allowEmployee,
      showField: this.settingEmployeeForm.value.showField,
      automaticallySignOut: this.settingEmployeeForm.value.automaticallySignOut,
      selected: this.settingEmployeeForm.value.selected,
      requestSignout: this.settingEmployeeForm.value.requestSignout,
      employeeFields: this.addText,
      signOutMessages: this.addMessages,
      employeeQuestionsText: this.addQuestionText,
      employeeQuestionsRadio: this.addyesnoQuestion,
    }

    this.SettingEmployeeService.updateEmployeeSetting(data).subscribe(res => {
      this.spinner = false;
      this.toastr.success("employee Data updated successfully")
    })
  }
  closeField() {
    this.field = false;
  }
  closeMessage() {
    this.message = false
  }
  closeText() {
    this.text = false
  }
}
