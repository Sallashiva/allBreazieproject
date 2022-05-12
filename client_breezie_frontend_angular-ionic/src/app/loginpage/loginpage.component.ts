import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertController, ModalController, Platform } from '@ionic/angular';
import { ModalPage } from 'src/app/modal/modal.page';
import { NavController } from '@ionic/angular';
import { ErrorStateMatcher } from '@angular/material/core';
import { RegisterService } from 'src/app/register/register.service';
import { Storage } from '@capacitor/storage';
import { alertController } from '@ionic/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VistorService } from '../vistor.service';
@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss'],
})

export class LoginpageComponent implements OnInit {
  @ViewChild('triggerForm', {
    static: false
  })
  triggerForm: NgForm;
  exform: FormGroup;
  error: string;
  stageData;
  errorState = false;
  errorMatcher = new CustomErrorStateMatcher();
  submitted = false;
  spinner: boolean = true;

  myFormGroup: FormGroup;
  formTemplate: any;
  formData1 = []
  token: string = null
  isDevice: Boolean = false
  url: string = "home"

  get addEmployeeFormControl() {
    return this.exform.controls;
  }

  constructor(
    private registerService: RegisterService,
    private toastr: ToastrService,
    private modalCtrl: ModalController,
    private navController: NavController,
    private platform: Platform,
    private router: Router,
    private visitorService: VistorService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe((data) => {
      if (data.key) {
        this.isDevice = data.device
        this.token = data.key;
        this.url = `home?key=${this.token}&device=true`
      }
    })
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.isDevice) {
        this.navController.navigateBack(`/home?key=${this.token}&device=true`);
      } else {
        this.navController.navigateBack('/home');
      }
    });
  }

  ngOnInit() {
    this.getForm();
    this.getAllFields();
    this.getDeviceSettings()
      setTimeout(() => {
        this.patchUserData();
      },500)
  }

  patchUserData() {
    if(localStorage.getItem('userData') !== null) {
    var patchData = localStorage.getItem('userData');
    this.patch = JSON.parse(patchData);
    this.formData1 = this.patch.Extrafields
     this.myFormGroup.patchValue({
      FullName:this.patch.FullName,
      CompanyName:this.patch.CompanyName,
     })
    }
  }

  deviceSetting
  selectHost: Boolean = false
  rememberVisitor: Boolean = false
  showQr:Boolean = false
  getDeviceSettings() {
    this.registerService.getSettings().subscribe(resp => {
      if (!resp.error) {
        this.deviceSetting = resp.companySettings
        this.showQr = resp.companySettings.contactLess.generateDynamicQR
        this.selectHost = this.deviceSetting.visitorSetting.selectHost
        this.rememberVisitor = this.deviceSetting.visitorSetting.rememberVisitor
      }
    }, err => {
      if (!this.isDevice) {
        this.navigateToDeviceLogout();
      }
    });
  }

  getForm() {
    this.formTemplate = this.formData1;
    let group = {}
    group["FullName"] = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(50)]),
      group["CompanyName"] = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(50)]),
      group["rememberMe"] = new FormControl(false),
      this.formData1.forEach(input_template => {
        group[input_template.label] = new FormControl(null);
      })
    this.myFormGroup = new FormGroup(group);
  }

  matRadio(event: any,label){
    this.formData1.forEach((ele)=>{
      if (ele.type=== "radio") {
        if (ele.label==label) {
          ele.value.forEach((val,i)=>{
              if (val.multi1===event) {
                val.multiCheckBox=true;
              }else{
                val.multiCheckBox=false;
              }
          })
        }
      }
    })

  }

  yesOrNo(event: any,label){
    this.formData1.forEach((ele,i)=>{
      if (ele.type=== "yes") {
        if (ele.label==label) {
          if (event=="yes") {
            ele.yes=true;
            ele.no=false;
          }else{
            ele.no=true;
            ele.yes=false;
          }
        }
      }
    })
  }

  customFields1 = {}
  object = {};
  arra = []
  finalData: any;
  onSubmit(myFormGroup: FormGroup) {
    this.formTemplate.forEach(ele=>{
      if(ele.type!=="radio" && ele.type!== "yes"){
        for (const item in this.myFormGroup.value) {
          if (ele.label == item) {
              ele.value=this.myFormGroup.value[item]
          }
      }
    }
    })
    this.object['Extrafields'] = this.arra;
    this.finalData = {
      FullName: this.myFormGroup.value.FullName,
      CompanyName: this.myFormGroup.value.CompanyName,
      rememberMe:this.toggleCheck,
      Extrafields:this.formData1
    }
    this.registerService.setData(this.finalData);
    if (this.selectHost == true) {
      if (this.isDevice) {
        this.navController.navigateRoot(['/register/employeelist'], {
          queryParams: {
            key: this.token,
            device: true
          }
        });
      } else {
        this.navController.navigateRoot(['/register/employeelist'])
      }
    } else {
      if (this.isDevice) {
        this.navController.navigateRoot(['/register/condition'], {
          queryParams: {
            key: this.token,
            device: true
          }
        });
      } else {
        this.navController.navigateRoot(['/register/condition'])
      }
    }
  }

  updateVisitorFields: any
  showRadio: boolean = false
  getAllFields() {
    this.visitorService.getWelcomScreen().subscribe(res => {
      setTimeout(() => {
        this.spinner = false
      }, 1000)
      this.formData1 = res.settings[0].visitorFieldSetting.addFields
      this.formData1.forEach(field => {
        if (field.required) {
          this.myFormGroup.addControl(field.label, new FormControl("", Validators.required))
        } else {
          this.myFormGroup.addControl(field.label, new FormControl(""))
        }
      })
    })
  }

  toggleCheck:boolean = false;
  fieldValue:any
  patch:any
  toggle(event) {
    this.toggleCheck = event.detail.checked;
  }

  triggerSubmit() {
    if (!this.triggerForm) {
      console.warn('triggerForm not assigned a value');
    } else {
      if (this.triggerForm.valid) {
        this.triggerForm.ngSubmit.emit();
      }
    }
  }
  registerVisitor(exform: FormGroup) {
    let date = new Date();
    this.exform.get('finalDate').setValue(date);
    this.registerService.registerVisitor(this.exform.value).subscribe(async (res) => {
      if (!res.error) {
        this.submitted = true;
        localStorage.setItem('message', res.message);
        localStorage.setItem('visitorId', res.visitorData[0]['_id'])
        await Storage.set({
          key: "visitorId",
          value: res.visitorData[0]['_id']
        })
        this.registerService.changeVisitorId()
        this.navController.navigateRoot(['register/employeelist'])
      } else {
        this.toastr.error(res.message);
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        if (window.screen.width <= 1024) {
          this.registerService.presentAlert();
        } else {
          this.toastr.error("CONNECTION_ERROR");
        }
      }
    });
  }

  navigateToDeviceLogout() {
    this.registerService.logOutDevice().subscribe(async res => {
      if (!res.error) {
        this.toastr.success(res.message);
        localStorage.clear();
        await Storage.clear();
        this.navController.navigateRoot(['welcomepage']);
      } else {
        this.toastr.error(res.message);
      }
    }, async err => {
      if (err.error.message == "Access Denied / Unauthorized request") {
        localStorage.clear();
        await Storage.clear();
        this.navController.navigateRoot(['welcomepage']);
        // this.navigateToDeviceLogout()
        // this.toastr.error(err.error.message);
      } else {
        // this.toastr.error("CONNECTION_ERROR");
      }
    })
  } 
  qrCodeOpen() {
    this.modalCtrl.create({
      component: ModalPage,
      backdropDismiss: false,
    }).then(modalres => {
      modalres.present();
    })
  }
}
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl, form: NgForm | FormGroupDirective | null) {
    return control && control.invalid && control.touched;
  }
}
