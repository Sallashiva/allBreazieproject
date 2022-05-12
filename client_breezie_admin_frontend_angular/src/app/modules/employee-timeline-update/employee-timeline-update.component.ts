import { Component, ElementRef, OnInit, ViewChild,Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { LocationService } from 'src/app/services/location.service';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';
import { TimelineService } from 'src/app/services/timeline.service';

@Component({
  selector: 'app-employee-timeline-update',
  templateUrl: './employee-timeline-update.component.html',
  styleUrls: ['./employee-timeline-update.component.css']
})
export class EmployeeTimelineUpdateComponent implements OnInit {
  deviceId: any
  locationId: any
  location: any
  selectedEmployeeToEdit:EmployeeResponse
  employee:EmployeeResponse[]
  employeeForm:FormGroup
  @ViewChild('form') form;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeAddModal') closeAddModal: ElementRef;

  constructor(private fb:FormBuilder, 
    private toast:ToastrService,
    private employeeService:TimelineService,@Inject(MAT_DIALOG_DATA) public editData:any ,
    private dialogRef:MatDialogRef<EmployeeTimelineUpdateComponent>,
    private toastr:ToastrService,
    private locationService: LocationService,
    private welcomeScree: WelcomeScreenService
    ) {
    this.employeeForm=this.fb.group({
      fullName: new FormControl('', [Validators.required,Validators.minLength(2), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(20)]),
      lastName: new FormControl('', [Validators.required,Validators.minLength(2), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
      phone: new FormControl('', [Validators.required,Validators.pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)]),
      location: new FormControl('', [Validators.required]),
      assistantEmail: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
      assistSms: new FormControl('', [Validators.required,Validators.pattern(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/)]),
    })
    if(this.editData){
      this.employeeForm.controls['fullName'].setValue(this.editData.fullName);
      this.employeeForm.controls['lastName'].setValue(this.editData.lastName);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['phone'].setValue(this.editData.phone);
      this.employeeForm.controls['location'].setValue(this.editData.location);
      this.employeeForm.controls['assistantEmail'].setValue(this.editData.assistantEmail);
      this.employeeForm.controls['assistSms'].setValue(this.editData.assistSms);
    }
   }

  ngOnInit(): void {
    this.getDeviceLOcatoion();
    this.getSettings()
  }
  formTemplate:any
  formData:any
  getSettings() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.formTemplate=res.settings[0].EmployeeSetting.employeeFields
      this.formData=res.settings[0].EmployeeSetting.employeeFields
      this.formTemplate.forEach((field,i) =>{
if(field.required){
  this.employeeForm.addControl(field.label+i , new FormControl("",Validators.required))
}else{
  this.employeeForm.addControl(field.label+i , new FormControl(""))
}
this.editData.ExtraFields.forEach((ele, i)=>{

  // this.employeeForm.get(field.label).setValue(ele.value);
  let elef=ele.value;
  this.employeeForm.patchValue({
    [field.label]:elef
  })
})
// this.employeeForm.controls['assistSms'].setValue(this.editData.assistSms);
      })
    })
  }
 
  errorState = false;
  telInputObject(obj) {
    obj.setCountry('in');
  }
  onCountryChange(e:any){
    
  }
  
  // onAddEmployee() {
  //   this.employeeService.addEmployee(this.employeeForm.value).subscribe(
  //     (res) => {
  //       if (!this.errorState) {
  //         this.form.resetForm();
  //       } else {
  //         this.form.reset();
  //       }
  //       if (!res.error) {
  //         this.toastr.success(res.message);
  //         this.employeeForm.reset();
  //         this.getAllEmployee();
  //       } else {
  //         this.toastr.error(res.message);
  //       }
  //     },
  //     (err) => {
  //       if (err.status) {
  //         this.toastr.error(err.error.message);
  //       } else {
  //         this.toastr.error('CONNECTION_ERROR');
  //       }
  //     }
  //   );
  //   this.closeAddModal.nativeElement.click()
  // }
  
  deviceLocation: any = []
  getDeviceLOcatoion() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      // this.deviceLocation.push(res)
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }

  companyLocationsData
  locations = []
  getCompanyLocations() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.companyLocationsData = res.deviceData
      for (let i = 0; i < this.companyLocationsData.length; i++) {
        if (this.companyLocationsData[i].locations) {
          this.locations.push(this.companyLocationsData[i])
        }
      }
    });
  }
 
  
  
  onUpdateTimeline() {
    // this.dialogRef.close('update');
    // this.employeeService.(this.employeeForm.value,this.editData.id)
    //   .subscribe((res) => {
        
    //     if (!res.error) {

    //       this.toast.success(res.message);
    //       this.employeeForm.reset();
    //     } else {
    //       this.toast.error(res.message);
    //     }
    //   }, err => {
    //     if (err.status) {
    //       this.toast.error(err.error.message);
    //     } else {
    //       this.toast.error("CONNECTION_ERROR");
    //     }
    //   });
    }
  }