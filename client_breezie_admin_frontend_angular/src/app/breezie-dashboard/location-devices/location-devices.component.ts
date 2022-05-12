import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { throws } from 'assert';
import { ToastrService } from 'ngx-toastr';
import { LocationResponce } from 'src/app/models/location';
import { LocationService } from 'src/app/services/location.service';
import { RegisterService } from 'src/app/services/register.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-devices',
  templateUrl: './location-devices.component.html',
  styleUrls: ['./location-devices.component.css']
})
export class LocationDevicesComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('closeEditModal') closeEditModal: ElementRef;
  editLocationform1: FormGroup
  deviceSetting: FormGroup
  newLocationform: FormGroup
  @ViewChild('close') closeButton: ElementRef
  @ViewChild('closeDelete') closeDeleteModel: ElementRef
  StoreDeleteDeviceLocationId: any
  Inputhide: boolean = false
  selectedEditLocation: LocationResponce
  editLocation: LocationResponce[]
  Digitoonz: any
  device: any
  expandPanel: any = -1
  spinner: boolean = true;
  expansionpanel: any = 0
  finalTimeZone: any
  appVersion= environment.version

  @ViewChild('f') myNgForm;
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private toastr: ToastrService,
    private registerService: RegisterService,
    private router:Router
  ) { }

  showFields:boolean = true
  checkboxDisabled:boolean = false
  employeeRole: string
  ngOnInit(): void {
    this.employeeRole= localStorage.getItem('employeeRole')
    if (this.employeeRole==="location manager") {
      this.showFields=false
      this.checkboxDisabled= true
    }else{
      this.showFields=true
      this.checkboxDisabled= false
    }
    this.getUserData();
    this.getRegister()
    this.editLocationform1 = this.fb.group({
      officeName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],

      // officeName: new FormControl('', [Validators.required]),
      // address: new FormControl('', [Validators.required]),
    })
    this.deviceSetting = this.fb.group({
      employeeInandOut: [false],
      visitorInandOut: [false],
      deliveries: [false],
      catering: [false],
      deviceName: [null, [Validators.minLength(0), Validators.maxLength(30)]]
    })
    this.newLocationform = this.fb.group({
      officeName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(20)]],
      address: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    })
    this.getDeiviceLocation()
  }

  companyTotalLocation: Number = 0
  deliveryShow: boolean = false
  cateringShow: boolean = false
  todayDate = new Date()
  getRegister() {
    this.locationService.getRegisterData().subscribe(res => {
      
      if (res.registeredData.deliveryAddOn) {
        let lastDay = res.registeredData.deliveryAddOn.endDate
        let lastDate: any = new Date(lastDay);
        if (lastDate > this.todayDate) {
          this.deliveryShow = true;
        } else {
          this.deliveryShow = false;
        }
        }else{
          this.deliveryShow = false;
        }
        if (res.registeredData.CateringAddOn) {
        let lastCateringDay = res.registeredData.CateringAddOn.endDate
        let lastCateringDays = new Date(lastCateringDay);
        if (lastCateringDays > this.todayDate) {
          this.cateringShow = true;
        } else {
          this.cateringShow = false;
        }
      }else{
        this.cateringShow = false;
      }

    })
  }

  // companyTotalLocation: Number = 0
  getDeiviceLocation() {
    this.spinner=true;
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.spinner = false;
      this.companyTotalLocation = res.deviceData.length
      this.device = res.deviceData
      res.deviceData.forEach((deviceData) => {
        this.employeeEvent = deviceData.devices.employeeInandOut
        this.visitorEvent = deviceData.devices.visitorInandOut
        this.DeliveriesEvent = deviceData.devices.deliveries
        this.CateringEvent = deviceData.devices.catering
        let location = {
          officeName: deviceData.locations.officeName,
          locatio: deviceData.locations.address
        }

        // this.editLocationform.patchValue({
        //   officeName: location.officeName,
        //   address: location.locatio
        // })
      })
    })
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var MyDate = new Date();
    var MyString = MyDate.toTimeString();
    var MyOffset = MyString.slice(9, 17);
    this.finalTimeZone = timezone + " (" + MyOffset + ")";
  }

  totalLocationPermited: Number = 0
  getUserData() {
    this.spinner=true;
    this.registerService.getRegister().subscribe((res) => {
      this.spinner=false;
      this.totalLocationPermited = res.registeredData.plan.location

    })
  }

  employeeEvent: Boolean = false
  visitorEvent: Boolean = false
  DeliveriesEvent: Boolean = false
  CateringEvent: Boolean = false
  Employee(event, id) {
    this.employeeEvent = event.checked
  }
  visitor(event, id) {
    this.visitorEvent = event.checked
  
  }
  Deliveries(event, id) {
    this.DeliveriesEvent = event.checked
  
  }
  Catering(event, id) {
    this.CateringEvent = event.checked
  
  }
  // editLocationSubmit(Id) {
  //   this.locationService.updateLocation(Id, this.editLocationform.value).subscribe((res) => {
  //     this.getDeiviceLocation()
  //   })
  // }

  deviceSettingSubmit(Id, deviceName, i) {
    this.spinner = true;
    this.expandPanel = i
    if (this.deviceSetting.value.deviceName === null) {
      let data = {
        catering: this.CateringEvent,
        deliveries: this.DeliveriesEvent,
        deviceName: deviceName,
        employeeInandOut: this.employeeEvent,
        visitorInandOut: this.visitorEvent
      }
      this.locationService.updateDeviceSetting(Id, data).subscribe((res) => {
        this.spinner = false
        this.Inputhide = false
        if (!res.error) {
          this.getDeiviceLocation()
          this.deviceSetting.reset()
          this.toastr.success(res.message)
        }
        else {

        }
      })
    } else {
      let data = {
        catering: this.CateringEvent,
        deliveries: this.DeliveriesEvent,
        deviceName: this.deviceSetting.value.deviceName,
        employeeInandOut: this.employeeEvent,
        visitorInandOut: this.visitorEvent
      }
      this.locationService.updateDeviceSetting(Id, data).subscribe((res) => {
        this.spinner = false
        this.Inputhide = false
        if (!res.error) {
          this.getDeiviceLocation()
          this.deviceSetting.reset()
          this.toastr.success()
        }
        else {

        }
      })
    }

    // let data = {
    //   catering: this.CateringEvent,
    //   deliveries: this.DeliveriesEvent,
    //   deviceName: this.deviceSetting.value.deviceName,
    //   employeeInandOut: this.employeeEvent,
    //   visitorInandOut: this.visitorEvent
    // }

  }

  newLocationSubmit() {
    this.expandPanel = true
    this.spinner = true
    this.locationService.addNewLocation(this.newLocationform.value).subscribe((res) => {
      if (!res.error) {
        this.spinner = false
        this.getDeiviceLocation()
        this.myNgForm.resetForm();
        // this.myNgForm.reset();

        this.toastr.success(res.message)
      }
      else {
        this.toastr.error(res.message)
      }
    }, error => {
      if (error.status) {
        this.toastr.error(error.error.message)
      } else {
        this.toastr.error("connection error")
      }
    })
    this.closeButton.nativeElement.click()
  }

  deviceIdentifierRefeshIcon(id, i) {
    this.spinner = true
    this.expandPanel = i
    var data = "data"
    this.locationService.getDeivicIdentifier(id, data).subscribe((res) => {
      this.spinner = false
      this.getDeiviceLocation()
    })
  }

  inputHide(data) {

    this.Inputhide = !this.Inputhide
  }
  getDeviceLocationId(id) {
    this.StoreDeleteDeviceLocationId = id
  }
  deleteDeviceLocationModel() {
    this.spinner = true
    this.locationService.deleteDeviceLOcation(this.StoreDeleteDeviceLocationId).subscribe((res) => {
      this.spinner = false
      if (!res.error) {
        this.getDeiviceLocation()
        this.closeDeleteModel.nativeElement.click()
        this.toastr.success(res.message)
      } else {
        this.toastr.error(res.message);
      }
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut()
      } else {
        this.toastr.error("connection error")
      }
    })
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  id: any
  onEdit(locationDeviceData) {
    this.id = locationDeviceData._id
    this.editLocationform1.patchValue({
      officeName: locationDeviceData.locations.officeName,
      address: locationDeviceData.locations.address,
    })
  }
  editLocationAddress() {
    this.spinner = true
    this.locationService.updateLocation(this.id, this.editLocationform1.value)
      .subscribe((res) => {
        this.spinner = false
        if (!res.error) {
          this.toastr.success(res.message);

          this.getDeiviceLocation();

        } else {
          this.spinner=false;
          this.toastr.error(res.message);
        }
      }, err => {
        if (err.status) {
          this.spinner=false;
          this.logOut();
          this.toastr.error(err.error.message);
        } else {
          this.spinner=false;
          this.toastr.error("CONNECTION_ERROR");
        }
      });
    this.closeEditModal.nativeElement.click();
  }
  expansionpanelexpand(i) {
    this.expansionpanel = i
  }
  CloseAlertModel() {
    this.closeDeleteModel.nativeElement.click()
  }

}
