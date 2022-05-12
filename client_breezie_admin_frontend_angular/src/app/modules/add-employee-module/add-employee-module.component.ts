import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-add-employee-module',
  templateUrl: './add-employee-module.component.html',
  styleUrls: ['./add-employee-module.component.css']
})
export class AddEmployeeModuleComponent implements OnInit {
  employeeForm: FormGroup
  deviceId: any
  locationId: any
  location: any
  @ViewChild('form') form;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeAddModal') closeAddModal: ElementRef;
  constructor(private fb: FormBuilder,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private welcomeScree:WelcomeScreenService,
    private dialogRef:MatDialogRef<AddEmployeeModuleComponent>,
  ) {


    this.employeeForm = this.fb.group({
      fullName: new FormControl('', [Validators.required,Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required,Validators.minLength(1), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
      phone: new FormControl('', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      location: new FormControl('', [Validators.required]),
      assistantEmail: new FormControl(''),
      assistSms: new FormControl(''),
      isRemoteUser:[false],
      finalDate: [new Date().toString()],
    })
  }

  ngOnInit(): void {
    this.getSettings()
    this.getDeviceLOcatoion();
    this.getAllEmployee();
  }
  telInputObject(obj) {
    obj.setCountry('in');
  }
  countryCode:any
  onCountryChange(e: any) {
    this.countryCode = e.dialCode
  }
  countryCode1:any
  onCountryChange1(e: any) {
    this.countryCode1 = e.dialCode
  }

  errorState = false;
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



  // getForm(){
  //   this.formTemplate = this.formData1;

  //   let group={}
  //   this.formData1.forEach(input_template=>{
  //     group[input_template.label]=new FormControl('');
  //   })
  //   this.myFormGroup = new FormGroup(group);

  // }
  customFields1 = {}
  object = {};
  arra = []


  formTemplate:any
  formData:any
  getSettings() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.formTemplate=res.settings[0].EmployeeSetting.employeeFields
      this.formData=res.settings[0].EmployeeSetting.employeeFields
      this.formTemplate.forEach(field =>{
if(field.required){
  this.employeeForm.addControl(field.label , new FormControl("",Validators.required))
}else{
  this.employeeForm.addControl(field.label , new FormControl(""))
}
      })
    })
  }



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
  getAllEmployee() {
    let start = 'All'
      let end = 'All'
    this.employeeService.getEmployee().subscribe(res => {

    })
  }

  onSubmit(myFormGroup: FormGroup) {


    // this.object["Extrafields"] = this.arra;
    // this.registerService.setData(this.object);
    // this.router.navigate(['register/employeelist']);
  }

  addEmployee() {

    this.formTemplate.forEach(input_template=>{
      for (const item in this.employeeForm.value) {
        if (input_template.label == item) {
          if (input_template.default) {
            this.object[item] = this.employeeForm.value[item]
          } else {
            this.customFields1 = {}
            this.customFields1["label"] = input_template.label
            this.customFields1["value"] = this.employeeForm.value[item]
            this.customFields1["fieldType"] = input_template.fieldType
            // this.customFields1["default"] = input_template.default
            this.arra.push(this.customFields1)
          }
        }
      }
    })
    this.object["Extrafields"] = this.arra;

    this.employeeService.addEmployee(
      this.employeeForm.value.fullName,
    this.employeeForm.value.lastName,
  this.employeeForm.value. email,
    this.employeeForm.value.phone,
    this.employeeForm.value.location,
    this.employeeForm.value. assistantEmail,
    this.employeeForm.value.assistSms,
    this.employeeForm.value. isRemoteUser,
   this.arra
    ).subscribe(res => {

      if (!res.error) {
        this.toastr.success(res.message);
        this.employeeForm.reset();
        this.getAllEmployee();
        this.dialogRef.close('add');
      } else {
        this.toastr.error(res.message);
      }
    }, (err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }
  cancel(){
    this.dialogRef.close();
  }
}
