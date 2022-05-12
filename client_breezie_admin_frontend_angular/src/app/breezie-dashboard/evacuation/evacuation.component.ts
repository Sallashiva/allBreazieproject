import { I } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { VisitorResponse } from 'src/app/models/visitor';
import { EmployeeService } from 'src/app/services/employee.service';
import { EvacuationService } from 'src/app/services/evacuation.service';
import { VisitorService } from 'src/app/services/visitor.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-evacuation',
  templateUrl: './evacuation.component.html',
  styleUrls: ['./evacuation.component.css']
})


export class EvacuationComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['image', 'fullName', 'email', 'phone', 'status', 'action'];
  dataSource = new MatTableDataSource([]);
  logoutform: FormGroup;
  employeeLogoutform: FormGroup;
  evacuateAll: FormGroup;
  fileName = 'Breazie_Evacuation.xlsx';
  spinner: boolean = true;
  table: boolean = false;
  totalEvacuation: Number = 0

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private visitorService: VisitorService,
    private evacuationService: EvacuationService,
    private toastr: ToastrService,
    private employeeService: EmployeeService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getAllEvacuationData()
    this.logoutform = new FormGroup({
      'finalDate': new FormControl()
    })

    this.employeeLogoutform = new FormGroup({
      'type': new FormControl,
      'employeeId': new FormControl,
      'time': new FormControl,
      'signedOutMessage': new FormControl,
      'isRemoteSignedIn': new FormControl,
    })

    this.evacuateAll = new FormGroup({
      'type': new FormControl,
      'employeeId': new FormControl,
      'time': new FormControl,
      'signedOutMessage': new FormControl,
      'isRemoteSignedIn': new FormControl,
      'finalDate': new FormControl()
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort
  }

  print() {
    window.print()
  }
  visitors: VisitorResponse[]
  apiaResponse: any = [];
  totalEmployee: number = 0;
  totalVisitor: number = 0;


  convertexel() {

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var MM = today.getMinutes();
    var ampm = hh + MM >= 12 ? 'AM' : 'PM';
    hh = hh % 12;
    hh = hh ? hh : 12; // the hour '0' should be '12'
    // minutes = minutes < 10 ? '0' + minutes : minutes;

const fileName = "Breazie_Evacuation_" + mm + '-' + dd + '-' + yyyy + '-' + hh + '-' + MM + '-' + ampm + '-' + ".xlsx"
    let element = document.getElementById('excel-table') ;
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    ws['!cols'] = [];
    ws['!cols'][5] = { hidden: true };
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, fileName);
  }

  getAllEvacuationData() {
    this.spinner=true;
    this.totalEmployee = 0 
    this.totalVisitor = 0 
    this.evacuationService.getAllEvacuationData().subscribe(res => {
      this.totalEvacuation = res.response.length
      this.apiaResponse = res.response
      this.spinner = false
      this.table = true;
      this.visitors = res.response;
      this.dataSource.sort = this.sort;
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

      this.dataSource.sort = this.sort;
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
  signoutAll() {
    this.spinner=true;
    let date = new Date();
    this.evacuateAll.get('time').setValue(date)
    this.employeeLogoutform.get('type').setValue("logout")
    this.visitorService.evacuateAll(this.employeeLogoutform.value).subscribe(res => {
      if (!res.error) {
          this.spinner=false;
        this.getAllEvacuationData()
      }
    })
  }
  signout(ele: any) {
    this.spinner=true;
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
          this.spinner=false;
          this.getAllEvacuationData()
        }
      })
    } else if (ele.role == "Visitor") {
      this.spinner=true;
      let date = new Date();
      this.logoutform.get('finalDate').setValue(date);
      this.visitorService.addLogout(ele._id, this.logoutform.value).subscribe((res) => {
        if (!res.error) {
          // this.getTodayVisitor();
          // this.getVisitor();
          this.getAllEvacuationData()
          this.spinner=false;
        }
      }, err => {
        if (err.status) {
          this.toastr.error(err.error.message);
          this.spinner=false;
          this.logOut();
        } else {
          this.toastr.error("CONNECTION_ERROR");
          this.spinner=false;
        }
      });
    }
  }

 
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  //   if (this.dataSource.filteredData.length === 0) {
  //     if (filterValue.length >= 4) {
  //       (event.target as HTMLInputElement).value = null
  //       // this.dataSource = new MatTableDataSource(this.visitors);
  //     }
  //   }

  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource.filteredData.forEach(ele => {
      if (ele.FullName.trim().toLowerCase() === filterValue.trim().toLowerCase()) {
        (event.target as HTMLInputElement).value = null
      }
    }
    )
  }
}
