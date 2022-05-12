import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { VisitorService } from 'src/app/services/visitor.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';
import { VisitorsComponent } from '../visitors/visitors.component';
// import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-visitor-dialog',
  templateUrl: './visitor-dialog.component.html',
  styleUrls: ['./visitor-dialog.component.css']
})
export class VisitorDialogComponent implements OnInit {
  addVisitorForm: FormGroup
  @ViewChild('form') form;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeAddModal') closeAddModal: ElementRef;
  errorState: any;
  spinner:boolean=false;
  // datePipe: DatePipe = new DatePipe('en-US');
  constructor(
    private fb: FormBuilder,
    private visitorService: VisitorService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private welcomeScree: WelcomeScreenService,
    private toastr: ToastrService,@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<VisitorDialogComponent>
    ,private router:Router) { }
  
  ngOnInit(): void {

    this.addVisitorForm = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]],
      // CompanyName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/"^[a-zA-Z0-9!@#$&()-`.+,/\"]*$"./), Validators.maxLength(50)]],
      CompanyName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+[!.@&()]?[a-zA-Z0-9/@._]*$/), Validators.maxLength(50)]],
      location: ['', Validators.required],
      visiting: ['', Validators.required],
      finalDate: ['']
    })
    this.getDeviceLOcatoion()
    this.getAllEmployee()
    this.getAllVisitor()
    this.getSettings()
  }

  get location(): FormControl {
    return this.addVisitorForm.get('location') as FormControl
  }

  getAllVisitor() {
    this.spinner=true;
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.spinner=false;
    })
  }

  customFields1 = {}
  object = {};
  arra = []


  formTemplate:any
  formData:any
  defaultValues: any
  getSettings() {
    this.spinner=true;
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      console.log(res.settings[0].visitorFieldSetting.addFields);
      
      this.spinner=false;
      this.formTemplate=res.settings[0].visitorFieldSetting.addFields
      this.formData=res.settings[0].visitorFieldSetting.addFields
      this.formTemplate.forEach(field =>{
        if (field.type=="checkBox") {
          field.value.forEach(val=>{
            this.addVisitorForm.addControl(val.fieldName , new FormControl('',[Validators.required,Validators.maxLength(30)]))
             })
        }
        if(!field.hidden){
          if(field.required){
            this.addVisitorForm.addControl(field.label , new FormControl("",[Validators.required,Validators.maxLength(30)]))
          }else{
            this.addVisitorForm.addControl(field.label , new FormControl("",[Validators.maxLength(30)]))
          }
        }
      })
    })
  }


  // getFormattedDate(){
  // getFormattedDate(){
  //   var date = new Date();
  //   var transformDate = this.datePipe.transform(date, 'yyyy-MM-dd');
  //   return transformDate;
  // }

  matRadio(event: any,label){
    this.formTemplate.forEach((ele)=>{
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
    this.formTemplate.forEach((ele,i)=>{
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

  addVisitor() {
    this.spinner=true
    let finalDate = new Date();
    this.addVisitorForm.get('finalDate').setValue(finalDate);
    this.formTemplate.forEach(ele=>{
      if(ele.type!=="radio" && ele.type!== "yes"){
        for (const item in this.addVisitorForm.value) {
          if (ele.label == item) {
              ele.value=this.addVisitorForm.value[item]
          }
      }
    }
    })
    let data = {
      FullName:this.addVisitorForm.value.FullName,
      CompanyName:this.addVisitorForm.value.CompanyName,
      finalDate :this.addVisitorForm.value.finalDate,
      visiting:this.addVisitorForm.value.visiting,
      location:this.addVisitorForm.value.location,
      Extrafields:this.formTemplate
        }
    this.visitorService.postVisitor(data).subscribe(res => {
      if (!res.error) {
        this.spinner=false;
        this.toastr.success(res.message);
        this.addVisitorForm.reset();
        this.getAllVisitor();
        this.dialogRef.close('save');
      } else {
        this.toastr.error(res.message);
      }

    }, (err) => {
      if (err.status) {
        // this.toastr.error(err.error.message);
        this.logOut()
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  deviceLocation: any = []
  getDeviceLOcatoion() {
    this.spinner=true;
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.spinner=false;
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }
  values=[]
  obj:any
  checkboxes(event: any,box){
this.formTemplate.forEach((ele,i)=>{
  if (ele.type==="checkBox") {
    ele.value.forEach((val)=>{
      let fieldName= box.fieldName
      if (val.fieldName===fieldName) {
        val.fieldCheck2=event.checked
      }
    })
  }else if(ele.type!=="radio" && ele.type!== "yes"){
    for (const item in this.addVisitorForm.value) {
      if (ele.label == item) {
          ele.value=this.addVisitorForm.value[item]
      }
  }
}
})
  }
  employees:EmployeeResponse[]
  getAllEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      this.employees = res.employeeData
    });
  }

}
