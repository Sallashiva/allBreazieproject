import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SettingVisitorResponse } from 'src/app/models/SettingVisitor';
import { SettingVisitorService } from 'src/app/services/setting-visitor.service';

@Component({
  selector: 'app-setting-visitors',
  templateUrl: './setting-visitors.component.html',
  styleUrls: ['./setting-visitors.component.css']
})
export class SettingVisitorsComponent implements OnInit, AfterViewInit {
  disableSelect = new FormControl(false);
  card: boolean = false;
  isdisabled: boolean = true;
  disabledtime: boolean = false
  SettingVisitorForm: FormGroup
  show = false
  display = false
  true = true;
  istakePhoto: boolean = true;
  selectHostUnchecked: boolean = true;
  selectHostChecked: boolean = false;
  rememberVisitorUnchecked: boolean = false;
  rememberVisitorChecked: boolean = true;
  displayEmployeeUnchecked: boolean = true;
  displayEmployeeChecked: boolean = false;
  sendVisitorNotifactionUnchecked: boolean = true;
  sendVisitorNotifactionChecked: boolean = false;
  takePhotoOfVisitorUnchecked: boolean = true;
  takePhotoOfVisitorChecked: boolean = false;
  automaticalySignOutUnchecked: boolean = true;
  automaticalySignOutChecked: boolean = false;
  visitorCentralRecipientsUnchecked: boolean = true;
  visitorCentralRecipientsChecked: boolean = false;
  settingResponse: SettingVisitorResponse;
  rememberVisitorRemove = false
  lookup = true
  spinner: boolean = true;
  isChecked: Boolean = false;
  checked = true;
  editData: any;
  selectedVisitorToEdit: SettingVisitorResponse
  visitors: SettingVisitorResponse;
  arr: FormArray;
  // checked:boolean:
  form: FormGroup;
  @ViewChild('takePhotos') takePhotos: MatCheckbox;
  @ViewChild('selectHost') selectHost: MatCheckbox;
  @ViewChild('rememberVisitor') rememberVisitor: MatCheckbox
  @ViewChild('automaticalySignOut') automaticalySignOut: MatCheckbox
  @ViewChild('visitorCentralRecipients') visitorCentralRecipients: MatCheckbox
  @ViewChild('approvalCentralRecipients') approvalCentralRecipients: MatCheckbox
  dialogRef: any;


  constructor(private fb: FormBuilder, 
    private settingVisitor: SettingVisitorService, 
    private toastr: ToastrService,
    private router:Router) {
    this.approvelEmails = [];
    this.addEmails = [];
  }

  ngOnInit(): void {
    this.SettingVisitorForm = this.fb.group({
      rememberVisitor: [false],
      visitorNameMatch: [false],
      selectHost: [false],
      displayEmployeeList: [false],
      sendVisitorNotification: [false],
      select: [''],
      takePhotoOfVisitor: [false],
      automaticalySignOut: [false],
      time: [''],
      visitorCentralRecipients: [false],
      approvalCentralRecipients: [false],
      notificationEmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email,Validators.minLength(3),Validators.maxLength(30)]),
      mobilePhone: new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      approvalemail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email,Validators.minLength(3),Validators.maxLength(30)]),
     

    });
    // this.onUpdatePreRegister()
  }

  get notificationEmail(){
    return this.SettingVisitorForm.get('notificationEmail');
  }

  get approvalemail(){
    return this.SettingVisitorForm.get('approvalemail');
  }


  ngAfterViewInit(): void {
    this.getVisitorSettings();
  }

  onCountryChange(e: any) {
  }

  createItem(): FormGroup {
    return this.fb.group({})
  }

  // visitorname(e) {
  //   if (e.checked === true) {
  // this.visitorNameMatchUnchecked = false;
  // this.visitorNameMatchChecked = true;
  // } else {
  // this.visitorNameMatchUnchecked = true;
  // this.visitorNameMatchChecked = false;
  //   }
  // }

  selecthost(e) {
    if (e.checked === true) {
      this.selectHostUnchecked = false;

      // this.selectHostChecked = true;
    } else {
      this.selectHostUnchecked = true;
      this.SettingVisitorForm.get('displayEmployeeList').patchValue(false)
      this.SettingVisitorForm.get('sendVisitorNotification').patchValue(false)
      // this.selectHostChecked = false;
    }
  }

  remembervisitor(e) {
    if (e.checked === true) {
      this.rememberVisitorUnchecked = false;
      this.rememberVisitorChecked = true;
      this.card = false;
      this.rememberVisitorRemove = false
    } else {
      this.rememberVisitorUnchecked = true;
      this.rememberVisitorChecked = false;
      this.card = true;
      this.rememberVisitorRemove = false
    }
  }

  displayemployee(e) {
    if (e.checked === true) {
      this.displayEmployeeUnchecked = false;
    } else {
      this.displayEmployeeUnchecked = true;
    }
  }

  sendvisitor(e) {
    if (e.checked === true) {
      this.sendVisitorNotifactionUnchecked = false;
      // this.sendVisitorNotifactionChecked = true;
      this.isdisabled = false;
    } else {
      this.sendVisitorNotifactionUnchecked = true;
      // this.sendVisitorNotifactionChecked = false;
      this.isdisabled = true;
    }
  }

  takeaphoto(e) {
    if (e.checked === true) {
      this.takePhotoOfVisitorUnchecked = false;
      // this.takePhotoOfVisitorChecked = true;
    } else {
      this.takePhotoOfVisitorUnchecked = true;
      // this.takePhotoOfVisitorChecked = false;
    }
  }

  automaticallysignout(e) {
    if (e.checked === true) {
      this.automaticalySignOutUnchecked = false;
      // this.automaticalySignOutChecked = true;
      this.disabledtime = false
    } else {
      this.automaticalySignOutUnchecked = true;
      // this.automaticalySignOutChecked = false;
      this.disabledtime = this.true
    }
  }

  visitorcentralrecipient(e) {
    this.SettingVisitorForm.get('visitorCentralRecipients').patchValue(e.checked);
    if (e.checked === true) {
      this.SettingVisitorForm.get('notificationEmail') ?.setValidators([Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]);
      this.SettingVisitorForm.get('notificationEmail') ?.updateValueAndValidity();
    } else {
      this.SettingVisitorForm.get('notificationEmail') ?.clearValidators();
      this.SettingVisitorForm.get('notificationEmail') ?.reset('');
      this.SettingVisitorForm.get('notificationEmail') ?.updateValueAndValidity();
    }
  }

  approvalcentralrecipient(e) {
    this.SettingVisitorForm.get('approvalCentralRecipients').patchValue(e.checked);
    // if (e.checked === true) {
    //   this.SettingVisitorForm.get('approvalemail')?.setValidators([Validators.required,Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$")]);
    //   this.SettingVisitorForm.get('mobilePhone')?.setValidators([Validators.required,Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{10}$/)]);
    //   this.SettingVisitorForm.get('approvalemail')?.updateValueAndValidity();
    //   this.SettingVisitorForm.get('mobilePhone')?.updateValueAndValidity();
    // } else {
    //   this.SettingVisitorForm.get('approvalemail')?.clearValidators();
    //   this.SettingVisitorForm.get('mobilePhone')?.clearValidators();
    //   this.SettingVisitorForm.get('approvalemail')?.reset('');
    //   this.SettingVisitorForm.get('mobilePhone')?.reset('');
    //   this.SettingVisitorForm.get('approvalemail')?.updateValueAndValidity();
    //   this.SettingVisitorForm.get('mobilePhone')?.updateValueAndValidity();
    // }
  }

  onClick() {
    this.isChecked = true
    this.card = false;
    this.rememberVisitorChecked = true;
    this.rememberVisitorUnchecked = false
  }

  remove() {
    this.isChecked = false
    this.rememberVisitorUnchecked = false;
    this.card = false;
    this.rememberVisitorRemove = true
  }

  approvelEmails: Array < any > ;
  clickMe(input, approvelEmail) {
    if (approvelEmail !== null) {
      let obj = {
        email: approvelEmail,
        location: "Head Office"
      }
      this.approvelEmails.push(obj);
      this.SettingVisitorForm.get('approvalemail').reset()
      if (this.approvelEmails.length >= 3) {
        this.inputDisable = true
        this.SettingVisitorForm.get('approvalemail').disable()
      }
    
    }
  }

  deleteApprovelEmail(approvelEmail) {
    const index = this.approvelEmails.indexOf(approvelEmail);
    if (index >= 0) this.approvelEmails.splice(index, 1);
  }
  inputDisable: boolean = false;
  addEmails: Array < any > ;
  addItems(input, addEmail) {
    if (addEmail !== null) {
      let obj = {
        email: addEmail,
        location: "Head Office"
      }
      this.addEmails.push(obj);

      this.SettingVisitorForm.get('notificationEmail').reset()
      if (this.addEmails.length >= 3) {
        this.inputDisable = true
        this.SettingVisitorForm.get('notificationEmail').disable()
      }
    }

  }

  deleteAddEmail(addEmail) {
    const index = this.addEmails.indexOf(addEmail);
    if (index >= 0) this.addEmails.splice(index, 1);
    if (this.addEmails.length >= 3) {
      this.inputDisable = true
      this.SettingVisitorForm.get('notificationEmail').disable()
    }
  }
  visitor: any;
  visitorSetting: any;
  getVisitorSettings() {
   

    // this.settingVisitor.getVisitorSetting("6215bf6df9e2b6185682612f").subscribe(res => {
    this.settingVisitor.getVisitorSetting().subscribe((res) => {
      setTimeout(() => {
        this.spinner = false;
      }, 2000)
      this.spinner = false
      const vistSett = res.settings[0].visitorSetting

      this.SettingVisitorForm.patchValue({
        rememberVisitor: vistSett.rememberVisitor,
        visitorNameMatch: vistSett.visitorNameMatch,
        selectHost: vistSett.selectHost,
        takePhotoOfVisitor: vistSett.takePhotoOfVisitor,
        automaticalySignOut: vistSett.automaticallySignOut.isSignedOut,
        visitorCentralRecipients: vistSett.visitorNotifications.isNotification,
        approvalCentralRecipients: vistSett.approvalCentralRecipient.isAprroved,
        displayEmployeeList: vistSett.displayEmployeeList,
        sendVisitorNotification: vistSett.sendVisitorNotificationByEmail,
        time: vistSett.automaticallySignOut.time,
        mobilePhone: vistSett.mobilePhone,
        // select:vistSett.sendVisitorNotification.select,
      });
      if (vistSett.visitorNotifications.approvalemail.length > 0) {

        this.addEmails = vistSett.visitorNotifications.approvalemail
      }
      if (vistSett.approvalCentralRecipient.notificationEmail.length > 0) {

        this.approvelEmails = vistSett.approvalCentralRecipient.notificationEmail
      }
      this.isdisabled = !vistSett.sendVisitorNotification
    });
  }

  onFormSubmit() {
    this.spinner = true;
    let sendVisitorNotification = {
      isNotification: this.SettingVisitorForm.get('visitorCentralRecipients').value,
      approvalemail: this.addEmails
    }
    let approvalCentralRecipientn = {
      isAprroved: this.SettingVisitorForm.get('approvalCentralRecipients').value,
      notificationEmail: this.approvelEmails,
    }

    let automaticalySignOut = {
      isSignedOut: this.SettingVisitorForm.value.automaticalySignOut,
      time: this.SettingVisitorForm.value.time,
    }

    //   let sendVisitorNotifications= {
    //     isNotification:this.SettingVisitorForm.value.sendVisitorNotification,
    //        select: this.SettingVisitorForm.value.select,
    //  }
    let data = {
      rememberVisitor: this.SettingVisitorForm.value.rememberVisitor,
      visitorNameMatch: this.SettingVisitorForm.value.visitorNameMatch,
      selectHost: this.SettingVisitorForm.value.selectHost,
      displayEmployeeList: this.SettingVisitorForm.value.displayEmployeeList,
      sendVisitorNotificationByEmail: this.SettingVisitorForm.value.sendVisitorNotification,
      takePhotoOfVisitor: this.SettingVisitorForm.value.takePhotoOfVisitor,
      automaticallySignOut: automaticalySignOut,
      visitorNotifications: sendVisitorNotification,
      mobilePhone: this.SettingVisitorForm.value.mobilePhone,
      approvalCentralRecipient: approvalCentralRecipientn,
    }

    this.settingVisitor.updateVisitorSetting(data)
      .subscribe((res) => {
        if (!res.error) {
          this.spinner = false;
          this.toastr.success(res.message);
          this.SettingVisitorForm.reset();
          this.getVisitorSettings();
        } else {
          this.toastr.error(res.message);
        }
      }, err => {
        if (err.status) {
          this.toastr.error(err.error.message);
          this.logOut();
        } else {
          this.toastr.error("CONNECTION_ERROR");
        }
      });
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  // onUpdatePreRegister() {

  // }
}
