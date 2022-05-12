import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-empsignin',
  templateUrl: './empsignin.page.html',
  styleUrls: ['./empsignin.page.scss'],
})
export class EmpsigninPage implements OnInit {

  empForm: FormGroup;
  spinner = true;

  constructor(private navController: NavController,private employeeService:EmployeeService) { }

  ngOnInit() {

    this.getSettings();
    this.getLoginPageData();
    this.empForm = new FormGroup({
      example: new FormControl(''),
    })

  }

  loginStageData:any
  getLoginPageData() {
    this.employeeService.serviceData.subscribe(res=>{
      this.loginStageData = res;
    })
  }

  empData:any
  getSettings() {
    this.spinner = true;
    this.employeeService.getWelcomScreen().subscribe(res => {
      this.spinner = false;
      this.empData = res.settings[0].EmployeeSetting.employeeQuestionsText;
      this.empData.forEach(field =>{
        if(field.required){
        this.empForm.addControl(field.label , new FormControl("",Validators.required))
        }else{
        this.empForm.addControl(field.label , new FormControl(""))
        }
      })
    });

  }

  obj:any
  arra= [];
  object = {};
  naviagteToCamera() {
    this.empData.forEach(input_template=>{
      for (const item in this.empForm.value) {
        if (input_template.label == item) {
          if (input_template.default) {
            this.object[item] = this.empForm.value[item]
          } else {
            this.obj = {}
            this.obj["label"] = input_template.label
            this.obj["value"] = this.empForm.value[item]
            this.obj["type"] = 'text'
            this.arra.push(this.obj)
          }
        }
      }
    })
    this.object['signInMsg'] = this.arra;

    this.loginStageData.signedInQuestion = this.arra;
    this.employeeService.setData(this.loginStageData);
    this.navController.navigateRoot(['emp-camera']);
  }
  onSubmit() {
  }

}
