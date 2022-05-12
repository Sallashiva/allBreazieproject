import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { TimelineResponse } from 'src/app/models/timeline';
import { VisitorResponse } from 'src/app/models/visitor';
import { EmployeeSigninComponent } from 'src/app/modules/employee-signin/employee-signin.component';
import { EmployeeSignoutComponent } from 'src/app/modules/employee-signout/employee-signout.component';
import { VisitorSignOutModuleComponent } from 'src/app/modules/visitor-sign-out-module/visitor-sign-out-module.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvacuationService } from 'src/app/services/evacuation.service';
import { LocationService } from 'src/app/services/location.service';
import { PreRegisteredService } from 'src/app/services/pre-registered.service';
import { RegisterService } from 'src/app/services/register.service';
import { TimelineService } from 'src/app/services/timeline.service';
import { VisitorService } from 'src/app/services/visitor.service';
import { WelcomeScreenService } from 'src/app/services/welcome-screen.service';

export interface PeriodicElement {
  name: string;
  image: string;
  dateOut: string;
  dateIn: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  spinner: boolean = true;
  remainingVisitor: number = 0;
  remainingPreregistere: number = 0;
  registeredId: any
  apiResponse: any = []
  employeee: TimelineResponse[]
  visitors: VisitorResponse[]
  signInform: FormGroup
  displayedColumns: string[] = ['image', 'name', 'dateIn', 'dateOut'];
  displayedColumns1: string[] = ['SlNo', 'image', 'FullName', 'CompanyName', 'Host', 'loginTime', 'logoutTime'];
  allDataSource = new MatTableDataSource([])
  visitorDataSource = new MatTableDataSource([])
  employeeDataSource = new MatTableDataSource([])
  exform: FormGroup
  logoutform: FormGroup;
  employeeLogoutform: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('f') myNgForm;
  table: boolean;
  dataSource: MatTableDataSource<VisitorResponse>;
  paginator: any;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private visitorService: VisitorService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private timelineService: TimelineService,
    private preRegistered: PreRegisteredService,
    private registered: RegisterService,
    private toastr: ToastrService,
    private router: Router,
    private evacuationService: EvacuationService,
    private welcomeScree: WelcomeScreenService,
  ) { }

  ngOnInit(): void {
    this.signInform = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]],
      CompanyName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9/._ ]*$/), Validators.maxLength(50)]],
      location: ['', Validators.required],
      visiting: ['', Validators.required],
      finalDate: [new Date().toString()]
    });
    this.exform = new FormGroup({
      'type': new FormControl,
      'employeeId': new FormControl,
      'time': new FormControl,
      'signedOutMessage': new FormControl,
      'isRemoteSignedIn': new FormControl
    })
    this.logoutform = new FormGroup({
      'finalDate': new FormControl()
    })
    this.employeeLogoutform = new FormGroup({
      'type': new FormControl,
      'employeeId': new FormControl,
      'time': new FormControl,
      'signedOutMessage': new FormControl,
      'isRemoteSignedIn': new FormControl
    })
    // this.getBoth()
    // this.getAllVisitors();
    this.getRemainingVisitor()
    this.getAllEvacuationData()
    this.getDeviceLocatoion()
    this.getAllEmployee()
    this.getRemainingPreregister()
    this.registeredId = localStorage.getItem('dataBaseID')
    this.getRegisterData();
    this.getAllaDetails();
    this.getBoth()
    this.getAllVisitors()
    this.getSettings();

  }

  onFormSubmit() {
    let finalDate = new Date();
    this.signInform.get('finalDate').setValue(finalDate);
    this.formTemplate.forEach(ele => {
      if (ele.type !== "radio" && ele.type !== "yes") {
        for (const item in this.signInform.value) {
          if (ele.label == item) {
            ele.value = this.signInform.value[item]
          }
        }
      }
    })

    let data = {
      FullName: this.signInform.value.FullName,
      CompanyName: this.signInform.value.CompanyName,
      finalDate: this.signInform.value.finalDate,
      visiting: this.signInform.value.visiting,
      location: this.signInform.value.location,
      Extrafields: this.formTemplate
    }
    this.spinner = true
    this.visitorService.addNewVisitor(data).subscribe((res) => {
      this.spinner = false;
      if (!res.error) {
        this.getVisitorTimeline()
        this.getBoth()
        this.getRemainingVisitor()
        // this.signInform.reset()
        this.myNgForm.resetForm();


      } else {

      }
    })
  }

  deviceLocation: any = []
  getDeviceLocatoion() {
    this.locationService.getDeiviceLocation().subscribe(res => {
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }

  employees: any = []
  getAllEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
      res.employeeData.forEach(data => {
        this.employees.push(data);
      })
    });
  }

  totalEmployee: number = 0
  totalVisitor: number = 0
  total: VisitorResponse[]
  getAllEvacuationData() {
    this.spinner = true;
    this.evacuationService.getAllEvacuationData().subscribe(res => {
      this.spinner = false
      this.total = res.response;
      this.totalEmployee = 0
      this.totalVisitor = 0
      this.total.forEach((ele, i) => {
        if (ele.role == "Employee" || ele.role == "Admin" || ele.role == "location manager" || ele.role == "company admin") {
          this.totalEmployee = this.totalEmployee + 1
        } else if (ele.role == "Visitor") {
          this.totalVisitor = this.totalVisitor + 1
        }
      })
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
  getRemainingVisitor() {
    this.spinner = true
    this.visitorService.remainingVisitor().subscribe(res => {
      this.remainingVisitor = res.data.length;
      this.spinner = false
    });
  }

  lastDay: any
  days
  remaningDays: number = 0
  pogressBar: number = 0
  freeTrail: Boolean = false
  getRegisterData() {
    this.spinner = true;
    this.registered.getRegister().subscribe(res => {
      if (!res.error) {
        if (res.registeredData.plan.planName == "FreeTrial") {
          this.freeTrail = true
        }
        this.spinner = false;
        this.lastDay = res.registeredData.plan.endDate
        let lastDate: any = new Date(this.lastDay);
        let todayDate: any = new Date()
        var difference = Math.abs(lastDate - todayDate)
        this.days = Math.ceil(difference / (1000 * 3600 * 24))
        this.remaningDays = this.days
        this.pogressBar = (7.14 * this.remaningDays)
      }
    });
  }
  preregisterRemining = []
  getRemainingPreregister() {
    this.spinner = true
    this.preRegistered.remainingPreregister().subscribe(res => {
      this.spinner = false
      res.data.forEach((ele) => {
        let end = new Date()
        let year = end.getFullYear()
        let month = end.getMonth()
        let date = end.getDate();
        let dateFilter = new Date(year, month, date)
        if (new Date(ele.dateOut) >= dateFilter) {
          this.preregisterRemining.push(ele)
        }
      })
      this.remainingPreregistere = this.preregisterRemining.length;
    });
  }

  reDiractEvacuation() {
    this.router.navigate(['/breezie-dashboard/evacuation'])
  }

  onVisitorLink() {
    this.router.navigate(['/breezie-dashboard/visitors']);
  }

  reDirectToPreRegister() {
    this.router.navigate(['/breezie-dashboard/pre-registration']);
  }

  reDirectToEmployee() {
    this.router.navigate(['/breezie-dashboard/employees']);
  }

  // openSigninDialog(data) {
  // const dialogRef = this.dialog.open(EmployeeSigninComponent, {
  //   width: '20%'
  // });
  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //       let date = new Date();
  //       this.exform.get('type').setValue("login")
  //       if (data.employeeId) {
  //         this.exform.get('employeeId').setValue(data.employeeId)
  //       } else {
  //         this.exform.get('employeeId').setValue(data._id)
  //       }
  //       this.exform.get('time').setValue(date)
  //       this.employeeService.signOutEmployee(this.exform.value).subscribe(res => {
  //         if (!res.error) {
  //           this.getAllEmployee();
  //           // this.getAllTimeline();
  //         }
  //       })
  //     }
  //   })
  // }

  openVisitorOutDailog(ele) {
    if (ele.role == "Employee" || ele.role == "Admin") {
      const dialogRef = this.dialog.open(EmployeeSignoutComponent, {
        width: '24%'
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          let date = new Date();
          this.exform.get('type').setValue("logout")
          if (ele.employeeId) {
            this.exform.get('employeeId').setValue(ele.employeeId)
          } else {
            this.exform.get('employeeId').setValue(ele._id)
          }
          this.exform.get('time').setValue(date)
          this.employeeService.signOutEmployee(this.exform.value).subscribe(res => {
            if (!res.error) {
              this.getAllEmployee();
              this.getEmployeeTimeline()
              // this.getAllTimeline();
            }
          })
        }
      })
    } else if (ele.role == "Visitor") {


      const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
        maxWidth: '25vw',
        width: '100%',
        disableClose: true,
        data: ele
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getRemainingVisitor()
          this.getAllEvacuationData()
          this.getAllaDetails();
          this.getBoth()
        }
      });
      // const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
      //   maxWidth: '25vw',
      //   width: '100%',
      //   disableClose:true,
      // });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result === 'signOuts') {
      //     let date = new Date();
      //     this.logoutform.get('finalDate').setValue(date);
      //     this.visitorService.addLogout(ele._id, this.logoutform.value).subscribe((res) => {
      //       if (!res.error) {
      //         this.getRemainingVisitor()
      //         this.getAllEvacuationData()
      //         this.getAllaDetails();
      //         this.getBoth()
      //       }
      //     }, err => {
      //       if (err.status) {
      //         this.toastr.error(err.error.message);
      //       } else {
      //         this.toastr.error("CONNECTION_ERROR");
      //       }
      //     });
      //     this.getBoth();
      //   }
      // });
    } else {
      const dialogRef = this.dialog.open(EmployeeSignoutComponent, {
        width: '24%',
        data: ele
      });
      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          let date = new Date();
          this.exform.get('type').setValue("logout")
          if (ele.employeeId) {
            this.exform.get('employeeId').setValue(ele.employeeId)
          } else {
            this.exform.get('employeeId').setValue(ele._id)
          }
          this.exform.get('time').setValue(date)
          this.employeeService.signOutEmployee(this.exform.value).subscribe(res => {
            if (!res.error) {
              this.getAllEmployee();
              this.getEmployeeTimeline()
              this.getBoth()
              this.getAllEvacuationData()
              // this.getAllTimeline();
            }
          })
        }
      })
    }
  }
  // openVisitorOutDailog(){

  //   const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
  //     maxWidth: '25vw',
  //     width: '100%',
  //     disableClose:true,
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //     if (result === 'signOuts') {
  //       this.getBoth();
  //     }
  //   });
  // }


  openSignOutVisitor(row: any) {
    const dialogRef = this.dialog.open(VisitorSignOutModuleComponent, {
      maxWidth: '25vw',
      width: '100%',
      disableClose: true,
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getVisitorTimeline();
        this.getBoth();
        this.getAllVisitors()
      }
    });
  }

  // openVisitorOutDailog(){

  // }

  openSinOutDialog(data) {
    const dialogRef = this.dialog.open(EmployeeSignoutComponent, {
      width: '24%',
      data: data
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        let date = new Date();
        this.exform.get('type').setValue("logout")
        if (data.employeeId) {
          this.exform.get('employeeId').setValue(data.employeeId)
        } else {
          this.exform.get('employeeId').setValue(data._id)
        }
        this.exform.get('time').setValue(date)
        this.employeeService.signOutEmployee(this.exform.value).subscribe(res => {
          if (!res.error) {
            this.getAllEmployee();
            this.getEmployeeTimeline()
            this.getAllEvacuationData()
            // this.getAllTimeline();
          }
        })
      }
    })
  }


  onChange2(event: any) {
    if (event.tab.textLabel == "All") {
      this.getBoth()
    } else if (event.tab.textLabel == "Guest") {
      this.getVisitorTimeline()
    } else if (event.tab.textLabel == "Employees") {
      this.getEmployeeTimeline()
    }
  }

  getBoth() {
    this.visitorService.getMeargedData().subscribe(res => {
      this.spinner = false
      this.visitors = res.finalResponse;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.allDataSource = new MatTableDataSource([
        ...res.finalResponse
      ]);
      this.allDataSource.sort = this.sort;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

  getAllVisitors() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.apiResponse = res.visitorArray
      this.spinner = false
      this.table = true;
      this.visitors = res.visitorArray;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.dataSource = new MatTableDataSource([
        ...res.visitorArray
      ]);
      // this.selection = new SelectionModel([
      //   ...res.visitorData
      // ])
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

  getVisitorTimeline() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.spinner = false
      this.visitors = res.visitorArray;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.visitorDataSource = new MatTableDataSource([
        ...res.visitorArray
      ]);
      this.visitorDataSource.sort = this.sort;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

  getEmployeeTimeline() {
    var start = 'All'
    var end = 'All'
    this.timelineService.getTimeline(start, end).subscribe(res => {
      this.spinner = false
      this.employeee = res.timeline;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.employeeDataSource = new MatTableDataSource([
        ...res.timeline
      ]);
      this.employeeDataSource.sort = this.sort;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }
  preApiResponse: any
  getAllaDetails() {
    this.preRegistered.getPreRegisteredDeatils().subscribe((res) => {
      this.preApiResponse = res.visitors
    });
  }

  formTemplate: any
  formData: any
  getSettings() {
    this.welcomeScree.getWelcomScreen().subscribe(res => {

      this.formTemplate = res.settings[0].visitorFieldSetting.addFields
      this.formData = res.settings[0].visitorFieldSetting.addFields
      this.formTemplate.forEach(field => {
        if (field.type == "checkBox") {
          field.value.forEach(val => {
            this.signInform.addControl(val.fieldName, new FormControl(""))
          })
        }

        if (field.required) {
          this.signInform.addControl(field.label, new FormControl("", Validators.required))
        } else {
          this.signInform.addControl(field.label, new FormControl(""))
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

}
