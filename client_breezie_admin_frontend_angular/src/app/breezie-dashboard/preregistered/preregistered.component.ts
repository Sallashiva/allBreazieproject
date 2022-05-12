import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PreRegistererResponse } from 'src/app/models/pre-register';
import { PreRegisterDeleteComponent } from 'src/app/modules/pre-register-delete/pre-register-delete.component';
import { PreRegisterUpdateComponent } from 'src/app/modules/pre-register-update/pre-register-update.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { LocationService } from 'src/app/services/location.service';
import { PreRegisteredService } from 'src/app/services/pre-registered.service';

export interface PeriodicElement {
  name: string;
  info: string;
  dateOut: string;
  dateIn: string;
  visitor: string;
  delete: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  // { image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80', name: 'Sameer chopra', info: 'sdf', dateIn: 'djdjjjjjjjjjjjjjj', dateOut: 'dmdmmd', visitor: 'hii' }
];


@Component({
  selector: 'app-preregistered',
  templateUrl: './preregistered.component.html',
  styleUrls: ['./preregistered.component.css']
})
export class PreregisteredComponent implements OnInit {
  signInform: FormGroup
  preRegisteredDetails;
  table: boolean = false;
  // dataSource = new MatTableDataSource(ELEMENT_DATA);
  // new MatTableDataSource([]);
  visitors: PreRegistererResponse[]
  spinner: boolean = false;
  PreRegisteredService: any;
  @Input() max: any;
  today = new Date();
  deviceId: any
  locationId: any
  submited = false
  location: any
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('f') myNgForm;

  dataSource = new MatTableDataSource([]);
  displayedColumns: string[] = ['fullName', 'info', 'visitor', 'dateOfVisit', 'dateOut', 'delete'];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private registered: PreRegisteredService,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private toastr: ToastrService,
    private router: Router,
    public dialogss: MatDialog,
  ) { }

  ngOnInit(): void {
    this.signInform = this.fb.group({
      fullName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(30)]),
      companyName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z][a-zA-Z ]*$/), Validators.maxLength(35)]),
      location: ['', Validators.required],
      locationId: [''],
      visitingHost: ['', Validators.required],
      dateOfVisit: [''],
      dateOut: ['', Validators.required]
    });
    this.getAllaDetails()
    this.getDeviceLOcatoion()
    this.getAllEmployee()
    this.today.setDate(this.today.getDate() + 0);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  employees: any = []
  getAllEmployee() {
    this.spinner = true;
    this.employeeService.getEmployee().subscribe(res => {
      this.spinner = false;
      res.employeeData.forEach(data => {
        this.employees.push(data.fullName);
      })
    });
  }

  get preRegisterControl() {
    return this.signInform.controls;
  }

  Dialog(row: any) {
    const dialogRef = this.dialogss.open(PreRegisterUpdateComponent, {
      width: '25%',
      data: row
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.getAllaDetails();
      }
    })
  }

  openDelete(element: any) {
    const dialogRef = this.dialogss.open(PreRegisterDeleteComponent, {
      width: '27%',
      disableClose: true,
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === "delete") {
        this.getAllaDetails();
      }
    });
  }


  deviceLocation: any = []
  getDeviceLOcatoion() {
    this.spinner = true
    this.locationService.getDeiviceLocation().subscribe(res => {
      // this.deviceLocation.push(res)
      this.spinner = false
      res.deviceData.forEach((deviceData) => {
        let location = {
          officeName: deviceData.locations.officeName,
          locationId: deviceData._id
        }
        this.deviceLocation.push(location);
      })
    })
  }
  errorState = false;
  onFormSubmit() {
    this.spinner = true;
    this.registered.addFormDetails(this.signInform.value).subscribe((res) => {
      if (!this.errorState) {
        this.myNgForm.resetForm();
      } else {
        this.myNgForm.reset();
      }
      this.signInform.markAsUntouched();
      if (!res.error) {
        this.submited = true
        this.getAllaDetails()
        this.spinner = false
      } else {
        this.toastr.error(res.message);
      }
    })
  }

  companyLocationsData
  locations = []
  getCompanyLocations() {
    this.spinner = true
    this.locationService.getDeiviceLocation().subscribe(res => {
      this.spinner = false
      this.companyLocationsData = res.deviceData
      // this.dataSource.sort = this.sort
      for (let i = 0; i < this.companyLocationsData.length; i++) {
        if (this.companyLocationsData[i].locations) {
          this.locations.push(this.companyLocationsData[i])
        }
      }
    });
  }

  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  // new MatTableDataSource([]);


  getAllaDetails() {
    this.spinner = true
    this.registered.getPreRegisteredDeatils().subscribe(res => {
      this.spinner = false
      this.table = true;
      this.visitors = res.visitors;
      this.dataSource.sort = this.sort;
      this.dataSource = new MatTableDataSource([
        ...res.visitors
      ]);
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
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
}
