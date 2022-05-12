import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VisitorResponse } from 'src/app/models/visitor';
import { EmployeeService } from '../services/employee.service';
import { EvacuationService } from '../services/evacuation.service';
import { VisitorService } from '../services/visitor.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit, AfterContentChecked {
  @ViewChild(MatSort) sort: MatSort;
  remainingVisitor: number = 0;
  dataSource = new MatTableDataSource([])
  visitors: VisitorResponse[]
  displayedColumns: string[] = ['image', 'name', 'email', 'phone', 'SignOut'];
  displayedColumns1: string[] = ['SlNo', 'image', 'FullName', 'CompanyName', 'Host', 'loginTime', 'logoutTime', 'SignOut'];
  logoutform: FormGroup;
  employeeLogoutform: FormGroup
  constructor(
    private visitorService: VisitorService,
    private toastr: ToastrService,
    private router: Router,
    private evacuationService: EvacuationService,
    private employeeService: EmployeeService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.getRemainingVisitor()
    // this.getAllVisitors()
    // window.print();
    this.getAllEvacuationData()
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
    window.print();
  }
  userDisplayName = '';
  ngAfterContentChecked() {
    this.changeDetector.detectChanges()
    this.userDisplayName = localStorage.getItem('userName');
  }
  totalEvacuation: Number = 0;
  apiaResponse: any = [];
  totalEmployee: number = 0;
  totalVisitor: number = 0;

  getAllEvacuationData() {
    this.evacuationService.getAllEvacuationData().subscribe(res => {
      this.totalEvacuation = res.response.length
      this.apiaResponse = res.response
      this.visitors = res.response;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.visitors.forEach((ele, i) => {
        if (ele.role == "Employee" || ele.role == "Admin") {
          this.totalEmployee = this.totalEmployee + 1
        } else if (ele.role == "Visitor") {
          this.totalVisitor = this.totalVisitor + 1
        }
      })
      this.dataSource = new MatTableDataSource([
        ...res.response
      ]);
      // this.selection = new SelectionModel([
      //   ...res.visitorData
      // ])
      this.dataSource.sort = this.sort;

    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

  signout(ele: any) {
    if (ele.role == "Employee" || ele.role == "Admin") {
      let date = new Date();
      this.employeeLogoutform.get('type').setValue("logout")
      if (ele.employeeId) {
        this.employeeLogoutform.get('employeeId').setValue(ele.employeeId)
      } else {
        this.employeeLogoutform.get('employeeId').setValue(ele._id)
      }
      this.employeeLogoutform.get('time').setValue(date)
      this.employeeService.signOutEmployee(this.employeeLogoutform.value).subscribe(res => {
        if (!res.error) {
          this.getAllEvacuationData()
        }
      })
    } else if (ele.role == "Visitor") {
      let date = new Date();
      this.logoutform.get('finalDate').setValue(date);
      this.visitorService.addLogout(ele._id, this.logoutform.value).subscribe((res) => {
        if (!res.error) {
          // this.getTodayVisitor();
          // this.getVisitor();
          this.getAllEvacuationData()
        }
      }, err => {
        if (err.status) {
          this.toastr.error(err.error.message);
        } else {
          this.toastr.error("CONNECTION_ERROR");
        }
      });
    }
  }

  getAllVisitors() {
    var start = 'All'
    var end = 'All'
    this.visitorService.getVisitor(start, end).subscribe(res => {
      this.visitors = res.visitorArray;
      this.visitors.forEach((ele, i) => {
        ele.SlNo = i + 1
      })
      this.dataSource = new MatTableDataSource([
        ...res.visitorArray
      ]);
      this.dataSource.sort = this.sort;
    }, err => {
      if (err.status) {
        this.toastr.error(err.error.message);
      } else {
        this.toastr.error("CONNECTION_ERROR");
      }
    });
  }

  getRemainingVisitor() {
    this.visitorService.remainingVisitor().subscribe(res => {
      this.remainingVisitor = res.data.length;
    });
  }
  printData() {
    window.print();
  }

}
