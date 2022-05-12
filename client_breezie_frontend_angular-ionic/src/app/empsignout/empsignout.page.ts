import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-empsignout',
  templateUrl: './empsignout.page.html',
  styleUrls: ['./empsignout.page.scss'],
})
export class EmpsignoutPage implements OnInit {

  constructor(private navController: NavController,private employeeService:EmployeeService) { }

  ngOnInit() {
    this.getSettings();
    this.getLogoutPageData();
  }

  stageData:any
  getLogoutPageData() {
    this.employeeService.serviceData.subscribe(res=>{
      this.stageData = res;
      this.stageData.signedOutMessage = this.signOutValue;
      // this.stageData.signedInQuestion = null;
    })
  }

  signOutValue:any
  signOut(data){
    this.signOutValue=data
  }

  empData:any
  getSettings() {
    this.employeeService.getWelcomScreen().subscribe(res => {
      this.empData = res.settings[0].EmployeeSetting.signOutMessages;
    });
  }
  naviagteToCamera() {
    this.employeeService.setData( this.stageData);
    this.navController.navigateRoot(['emp-camera']);
  }
}
