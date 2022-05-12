import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { LocationService } from 'src/app/services/location.service';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

@Component({
  selector: 'app-add-employee-update-dialog',
  templateUrl: './add-employee-update-dialog.component.html',
  styleUrls: ['./add-employee-update-dialog.component.css']
})
export class AddEmployeeUpdateDialogComponent implements OnInit {
  deviceId: any
  locationId: any
  location: any
  selectedEmployeeToEdit: EmployeeResponse
  employee: EmployeeResponse[]
  employeeForm: FormGroup
  @ViewChild('form') form;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeAddModal') closeAddModal: ElementRef;
  constructor(private fb: FormBuilder,
    private toast: ToastrService,
    private employeeService: EmployeeService, @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef < EmployeesComponent > ,
    private toastr: ToastrService,
    private locationService: LocationService,
    private welcomeScree: WelcomeScreenService
  ) {
    this.employeeForm = this.fb.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(1), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}$/), Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      location: new FormControl('', [Validators.required]),
      locationName: new FormControl('', [Validators.required]),
      assistantEmail: new FormControl(''),
      assistSms: new FormControl(''),
      isRemoteUser: new FormControl('', [Validators.required]),
    })
    if (this.editData) {

      this.employeeForm.controls['fullName'].setValue(this.editData.fullName);
      this.employeeForm.controls['lastName'].setValue(this.editData.lastName);
      this.employeeForm.controls['email'].setValue(this.editData.email);
      this.employeeForm.controls['phone'].setValue(this.editData.phone);
      this.employeeForm.controls['location'].setValue(this.editData.locationId);
      this.employeeForm.controls['locationName'].setValue(this.editData.locationName);
      this.employeeForm.controls['assistantEmail'].setValue(this.editData.assistantEmail);
      this.employeeForm.controls['assistSms'].setValue(this.editData.assistSms);
      // if(this.editData.isRemoteUser == true){
      //   this.employeeForm.controls['isRemoteUser'].setValue(this.editData.Enable)

      // }else(this,editData.isRemoteUser == false)
      // this.employeeForm.controls['isRemoteUser'].setValue(this.editData.Disable)
      this.employeeForm.controls['isRemoteUser'].setValue(this.editData.isRemoteUser)
    }

  }
  selectedEmp = ''
  ngOnInit(): void {
    this.getDeviceLOcatoion();
    this.getSettings();
    this.selectedEmp = this.editData.isRemoteUser;

  }


  formTemplate: any
  formData: any
  patchData: any;

  getSettings() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.formTemplate = this.editData.ExtraFields
      this.formTemplate.forEach((field) => {
        if (field.required) {
          this.employeeForm.addControl(field.label, new FormControl("", Validators.required))
        } else {
          this.employeeForm.addControl(field.label, new FormControl(""))
        }
      })

    })
  }
  telInputObject(obj) {
    obj.setCountry('in');
  }
  countryCode: any
  onCountryChange(e: any) {
    this.countryCode = e.dialCode
  }
  countryCode1: any
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


  // getAllEmployee(){
  //   this.employeeService.getEmployee().subscribe(res=>{

  //   })
  // }
  // addEmployee(){
  //   this.employeeService.addEmployee(this.employeeForm.value).subscribe(res=>{
  //     if (!res.error) {
  //       this.toastr.success(res.message);
  //       this.employeeForm.reset();
  //       this.getAllEmployee()
  //     } else {
  //       this.toastr.error(res.message);
  //     }
  //   }, (err) => {
  //     if (err.status) {
  //       this.toastr.error(err.error.message);
  //     } else {
  //       this.toastr.error('CONNECTION_ERROR');
  //     }
  //   }
  //   )
  // }

  onEdit(employee: EmployeeResponse) {
    this.selectedEmployeeToEdit = {
      ...employee
    };
  }
  customFields1 = {}
  object = {};
  arra = []
  onUpdateEmployee() {
    this.formTemplate.forEach(input_template => {
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
    let data = {
      fullName: this.employeeForm.value.fullName,
      lastName: this.employeeForm.value.lastName,
      email: this.employeeForm.value.email,
      phone: this.employeeForm.value.phone,
      location: this.employeeForm.value.location,
      assistantEmail: this.employeeForm.value.assistantEmail,
      assistSms: this.employeeForm.value.assistSms,
      isRemoteUser: this.employeeForm.value.isRemoteUser,
      ExtraFields: this.arra
    }

    this.employeeService.updateEmployee(data, this.editData._id)
      .subscribe((res) => {
        if (!res.error) {
          // this.visitor.splice(
          //   this.visitor.findIndex(
          //     (element) => element._id === res.response._id
          //   ),
          //   1,
          //   res.response
          // );
          this.toast.success(res.message);
          this.employeeForm.reset();
          this.dialogRef.close('update');
        } else {
          this.toast.error(res.message);
        }
      }, err => {
        if (err.status) {
          this.toast.error(err.error.message);
        } else {
          this.toast.error("CONNECTION_ERROR");
        }
      });
  }
}
