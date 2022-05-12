import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VisitorResponse } from 'src/app/models/visitor';
import { VisitorService } from 'src/app/services/visitor.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisitorsComponent } from '../visitors/visitors.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visitor-updatediolog',
  templateUrl: './visitor-updatediolog.component.html',
  styleUrls: ['./visitor-updatediolog.component.css']
})
export class VisitorUpdatediologComponent implements OnInit {
  VisitorForm: FormGroup;
  selectedVisitorToEdit: VisitorResponse;
  visitor: VisitorResponse[];
  deviceId: any
  locationId: any
  location: any
  logoutTime:any;
  loginTime:any
  VisitorImage:any
  isDisabled=true
  spinner:boolean=false;
  constructor(private fb: FormBuilder,
    private visitorService: VisitorService,
    private employeeService: EmployeeService,
    private locationService: LocationService,
    private welcomeScree: WelcomeScreenService,
    private router:Router,
    private toast: ToastrService, @Inject(MAT_DIALOG_DATA) public editData: any, private dialogRef: MatDialogRef < VisitorUpdatediologComponent > ) {}

  ngOnInit(): void {
    this.VisitorForm = this.fb.group({
      FullName: new FormControl('', [Validators.required,Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/),Validators.maxLength(30)]),
      ///^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/
      CompanyName: new FormControl('', [Validators.required,Validators.minLength(2), Validators.pattern(/^[a-zA-Z]+[!.@&()]?[a-zA-Z0-9/@._]*$/), Validators.maxLength(50)]),
      location: new FormControl('', [Validators.required]),
      locationName: new FormControl(''),
      HostName: new FormControl('', [Validators.required]),
      loginTime: [{
        
        disabled: true
      }],
      Date: new FormControl('', []),
      logoutTime: [{
        value: '',
        disabled: true
      }],
    })
    if (this.editData) {
      this.logoutTime=this.editData.logoutTime
      this.loginTime=this.editData.loginTime
      if (this.editData.VisitorImage) {
        this.VisitorImage = this.editData.VisitorImage
      }
      this.VisitorForm.controls['FullName'].setValue(this.editData.FullName);
      this.VisitorForm.controls['CompanyName'].setValue(this.editData.CompanyName);
      this.VisitorForm.controls['loginTime'].setValue(this.editData.loginTime);
      this.VisitorForm.controls['logoutTime'].setValue(this.editData.logoutTime);
      this.VisitorForm.controls['Date'].setValue(this.editData.date);
      this.VisitorForm.controls['location'].setValue(this.editData.locationId);
      
      this.VisitorForm.controls['locationName'].setValue(this.editData.locationName);
      this.VisitorForm.controls['HostName'].setValue(this.editData.HostName);
    }
    this.getAllEmployee()
    this.getDeviceLOcatoion()
    this.getSettings()
  }

  employees: any = []
  getAllEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      res.employeeData.forEach(data => {
        this.employees.push(data.fullName);
      })
    });
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

  customFields1 = {}
  object = {};
  arra = []


  formTemplate: any
  formData: any
  getSettings() {
    // this.values =this.editData.Extrafields.values
    this.welcomeScree.getWelcomScreen().subscribe(res => {
      this.formTemplate = this.editData.Extrafields
      this.editData.Extrafields.forEach(fields => {
        if (fields.fieldType == 'checkBox') {
          this.values = fields.value
        }
      })
      // this.formData=res.settings[0].visitorFieldSetting.addFields 
      this.formTemplate.forEach(field => {
        if (field.type == "checkBox") {
          field.value.forEach(val => {
            this.VisitorForm.addControl(val.fieldName, new FormControl(""))
          })
        }
        if (field.required) {
          this.VisitorForm.addControl(field.label, new FormControl("", Validators.required))
        } else {
          this.VisitorForm.addControl(field.label, new FormControl(""))
        }
      })
    })
  }

  matRadio(event: any, label) {
    this.formTemplate.forEach((ele) => {
      if (ele.type === "radio") {
        if (ele.label == label) {
          ele.value.forEach((val, i) => {
            if (val.multi1 === event) {
              val.multiCheckBox = true;
            } else {
              val.multiCheckBox = false;
            }

          })

        }


      }
    })

  }

  yesOrNo(event: any, label) {
    this.formTemplate.forEach((ele, i) => {
      if (ele.type === "yes") {
        if (ele.label == label) {
          if (event == "yes") {
            ele.yes = true;
            ele.no = false;
          } else {
            ele.no = true;
            ele.yes = false;
          }
        }
      }
    })
  }

  values = []
  obj: any
  checkboxes(event: any, box) {
    this.formTemplate.forEach((ele, i) => {
      if (ele.type === "checkBox") {
        ele.value.forEach((val) => {
          let fieldName = box.fieldName
          if (val.fieldName === fieldName) {
            val.fieldCheck2 = event.checked
          }
        })
      } else if (ele.type !== "radio" && ele.type !== "yes") {
        for (const item in this.VisitorForm.value) {
          if (ele.label == item) {
            ele.value = this.VisitorForm.value[item]
          }
        }
      }
    })


    // if (event.checked) {
    //   this.values.forEach((ele,i)=>{
    //     if (ele.fieldName===box.fieldName) {
    //       this.values.splice(i,1)
    //     }
    //   })
    //   this.values.push(this.obj);
    // }else{
    //   this.values.forEach((ele,i)=>{
    //     if (ele.fieldName===box.fieldName) {
    //       this.values.splice(i,1)
    //     }

    //   })
    //   this.values.push(this.obj);

    // }
  }


  onUpdateVisitor() {
    this.formTemplate.forEach(input_template => {
      for (const item in this.VisitorForm.value) {
        if (input_template.label == item) {
          if (input_template.default) {
            this.object[item] = this.VisitorForm.value[item]
          } else {
            this.customFields1 = {}
            this.customFields1["label"] = input_template.label
            this.customFields1["value"] = this.VisitorForm.value[item]
            this.customFields1["fieldType"] = input_template.fieldType
            this.customFields1["required"] = input_template.required
            if (input_template.fieldType === "checkBox") {
              this.customFields1["value"] = this.values
            }
            this.arra.push(this.customFields1)
          }
        }
      }
    })
    this.object["Extrafields"] = this.arra;

    let data = {
      FullName: this.VisitorForm.value.FullName,
      CompanyName: this.VisitorForm.value.CompanyName,
      TimeIn: this.VisitorForm.value.TimeIn,
      Date: this.VisitorForm.value.Date,
      TimeOut: this.VisitorForm.value.TimeOut,
      location: this.VisitorForm.value.location,
      HostName: this.VisitorForm.value.HostName,
      Extrafields: this.formTemplate
    }
    this.spinner=true;
    this.visitorService.updateVisitor(this.editData._id, data).subscribe((res) => {
      if (!res.error) {
        this.spinner=false;
        this.toast.success(res.message);
        this.VisitorForm.reset();
        this.dialogRef.close('update');
      } else {
        this.toast.error(res.message);
      }

    }, err => {
      if (err.status) {
        this.toast.error(err.error.message);
         this.logOut();
      } else {
        this.toast.error("CONNECTION_ERROR");
      }
    });
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
}
