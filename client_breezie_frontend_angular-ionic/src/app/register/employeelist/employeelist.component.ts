import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalPage } from 'src/app/modal/modal.page';
import { RegisterService } from '../register.service';
import { EmployeeResponse } from '../RegisterModel/employeesResponse';
import { Storage } from '@capacitor/storage';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/employee.service';
import { VistorService } from 'src/app/vistor.service';
@Component({
  selector: 'app-employeelist',
  templateUrl: './employeelist.component.html',
  styleUrls: ['./employeelist.component.scss'],
})
export class EmployeelistComponent implements OnInit {
  EmployeeList: EmployeeResponse[] = [];
  emailId;
  spinner = true;
  subscription: Subscription;
  employeeName: string;
  visitorId;
  fullName:string
  stageData;
  _id;
  isDevice: Boolean = false
  url: string = "home"
  selectHost: Boolean = false
  token: string = null
  path: string = "login"
  constructor(
    private employeeService: RegisterService,
    private toastr: ToastrService,
    private navController: NavController,
    private modalCtrl: ModalController,
    private platform: Platform,
    private activatedRoute: ActivatedRoute,
    private employeeServices: EmployeeService,
    private visitorService: VistorService,
    private fb: FormBuilder,
  ) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      this.navController.navigateBack('/login');
      if (this.isDevice) {
        this.navController.navigateRoot([`login?key=${this.token}&device=true`]);
      } else {
        this.navController.navigateRoot([`login`]);
      }
    });
  }
employeesShow:Boolean = true;
employeesHide:Boolean = false;
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.url = `home?key=${this.token}&device=true`
      }
    })
    this.employeeService.changeVisitorId()
    this.subscription = this.employeeService.currentVisitorId.subscribe(email => {
      this.emailId = email
    });
    this.getAllEmployee();

    this.getLoginPageData();

    if (this.stageData == 'Data is Empty') {
      if (this.isDevice) {
        this.navController.navigateRoot([`home`], {
          queryParams: {
            key: this.token,
            device: true
          }
        });
      } else {
        this.navController.navigateRoot([`home`]);
      }
    }

    if (this.isDevice) {
      this.path = `login?key=${this.token}&device=true`
    }
    // this.employeesShow=true;
    //     this.employeesHide=false;
    this.initForm()
    this.getEmployee()
    this.getAllFields()
  }



  getAllFields() {
    this.visitorService.getWelcomScreen().subscribe(res => {
     if (res.settings[0].visitorSetting.displayEmployeeList===true) {
      this.employeesShow=true;
      this.employeesHide=false;
     }else {
      this.employeesShow=false;
      this.employeesHide=true;
     }
    })
  }


  // _id: string
  deliveryForm: FormGroup;
  filteredOptions:any
  initForm() {
    this.deliveryForm = this.fb.group({
      empId: ['', Validators.required],
    })
    this.deliveryForm.get('empId').valueChanges.subscribe(response => {
      if (response && response.length > 2) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }

  nodata: boolean= false;
  employee:any
  empIds: any
  employeesArray:any
  filterData(enterData) {
    this.filteredOptions = this.employee.filter(item => {
      // this.empIds = item._id
      if (item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1) {
        this.empIds = item._id
      }
      return item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1
    });
    this.nodata = true;
    this.employeeServices.getEmploye(this.empIds).subscribe(res => {
      this.employeesArray=res.employeeData
    })
  }

  addDelivery(){
  }

  getEmployee() {
    this.employeeServices.getEmployee().subscribe(res => {
      this.employee = res.employeeData;
    });
  }

  getLoginPageData() {
    this.employeeService.serviceData.subscribe(res=>{
      this.stageData = res;
      this.stageData.visiting = this._id;
    })
  }
  getAllEmployee() {
    this.employeeService.employeeList().subscribe((res) => {
      if (!res.error) {
          this.spinner = false;
        this.EmployeeList = res.employeeData;
      } else {
        this.toastr.error('Something Went Wrong');
      }
    });
  }

  Search() {
    if (this.fullName == '') {
      this.ngOnInit();
    } else {
      this.EmployeeList = this.EmployeeList.filter((res) => {
        return res.fullName
          .toLocaleLowerCase()
          .match(this.fullName.toLocaleLowerCase());
      });
    }
  }
 async senMailToEmployee(id) {
   this._id = id._id;
    localStorage.setItem('employeeId',id._id);
   await Storage.set({key:"employeeId",value:id._id})
    this.employeeService.changeEmployeeId();
    // abbas changes
    this.employeeService.setData(this.stageData);
    if (this.isDevice) {
      this.navController.navigateRoot(['/register/condition'], {
        queryParams: {
          key: this.token,
          device: true
        }
      });
    } else {
      this.navController.navigateRoot(['register/condition']);
    }
  }

  qrCodeOpen() {
    this.modalCtrl
      .create({
        component: ModalPage,
        backdropDismiss: false,
      })
      .then((modalres) => {
        modalres.present();
      });
  }
}
