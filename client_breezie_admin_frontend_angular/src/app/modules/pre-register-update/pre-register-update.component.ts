import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PreRegistererResponse } from 'src/app/models/pre-register';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { PreRegisteredService } from 'src/app/services/pre-registered.service';

@Component({
  selector: 'app-pre-register-update',
  templateUrl: './pre-register-update.component.html',
  styleUrls: ['./pre-register-update.component.css']
})
export class PreRegisterUpdateComponent implements OnInit, AfterViewInit {
  deviceId: any
  locationId: any
  location: any
  spinner: boolean = false
  @Input() max: any;
  dateOfVisit = new Date();
  isDisabled = true
  // minDate: Date;
  // restrictMinDate: Date
  // maxDate: Date;
  today = new Date();
  // dateOfVisit:Date

  // isDisabled=true
  selectedpPreRegisterToEdit: PreRegistererResponse;
  preregister: PreRegistererResponse[]
  preRegisterForm: FormGroup;
  disabledBtn: boolean = false;


  @ViewChild('form') form;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  @ViewChild('closeAddModal') closeAddModal: ElementRef;
  listOfTrxForm: any;

  minDate: Date;

  constructor(private fb: FormBuilder,
    private toast: ToastrService,
    private preregisterService: PreRegisteredService, @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<PreRegisterUpdateComponent>,
    private toastr: ToastrService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
  ) {
    this.preRegisterForm = this.fb.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      companyName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(35)]),
      location: new FormControl('', [Validators.required]),
      locationName: new FormControl(''),
      visitingHost: new FormControl('', [Validators.required]),
      dateOfVisit: new FormControl('', [Validators.required]),
      dateOut: new FormControl('', [Validators.required])

    })
    if (this.editData) {
      this.preRegisterForm.controls['fullName'].setValue(this.editData.fullName);
      this.preRegisterForm.controls['companyName'].setValue(this.editData.companyName);
      this.preRegisterForm.controls['location'].setValue(this.editData.locationId);
      this.preRegisterForm.controls['locationName'].setValue(this.editData.locationName);
      this.preRegisterForm.controls['visitingHost'].setValue(this.editData.visitingHost);
      this.preRegisterForm.controls['dateOfVisit'].setValue(this.editData.dateOfVisit);
      this.minDate = this.editData.dateOfVisit
      this.preRegisterForm.controls['dateOut'].setValue(this.editData.dateOut);
    }
  }


  ngOnInit(): void {
    this.getDeviceLOcatoion();
    this.getAllEmployee()
    this.today.setDate(this.today.getDate());

  }

  // moment:any
  // onFromDate() {
  //   this.minDate = null;
  //   if (this.listOfTrxForm.get('dateOfVisit').value) {
  //     this.minDate = new Date(this.listOfTrxForm.get('dateOfVisit').value);
  //     // this.restrictMinDate = moment(this.minDate).add(30, 'days').toDate()
  //   }
  // }
  // onToDate() {
  //   this.maxDate = null;
  //   if (this.listOfTrxForm.get('dateOut').value) {
  //     this.maxDate = new Date(this.listOfTrxForm.get('dateOut').value);
  //     this.restrictMinDate = this.moment(this.minDate).add(30,'days').toDate()
  //   }
  // }

  ngAfterViewInit() {
    this.preRegisterForm.valueChanges.subscribe((v) => {
      if (this.preRegisterForm.get('fullName').valid && this.preRegisterForm.get('companyName').valid) {
        this.disabledBtn = false;
      } else {
        this.disabledBtn = true;
      }
    });
  }

  telInputObject(obj) {
    obj.setCountry('in');
  }
  onCountryChange(e: any) {

  }
  errorState = false;

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

  onUpdatePreRegister() {
    this.spinner = true
    this.dialogRef.close('update');
    this.preregisterService.updatePreregister(this.editData._id, this.preRegisterForm.value)
      .subscribe((res) => {
        if (!res.error) {
          this.toast.success(res.message);
          this.preRegisterForm.reset();
          this.spinner = false
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
