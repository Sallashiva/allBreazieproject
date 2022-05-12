import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { AdminRoleDialogComponent } from 'src/app/modules/admin-role-dialog/admin-role-dialog.component';
import { EmployeeService } from 'src/app/services/employee.service';



export interface PeriodicElement {
  employee: string;
  email: string;
  role: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  // {employee: 'dfgh',email:'dfghj' ,role: 'H'},
  // {employee: 'xcvb',email:'qwert' ,role: 'H'},

];
@Component({
  selector: 'app-adminroles',
  templateUrl: './adminroles.component.html',
  styleUrls: ['./adminroles.component.css']
})
export class AdminrolesComponent implements OnInit {
  displayedColumns: string[] = ['image','fullName', 'email', 'role', 'delete'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  adminRoleForm: FormGroup
  filteredOptions;
  nodata: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  allEmployeeDetails: EmployeeResponse[]
  dataSource = new MatTableDataSource([])
  spinner: boolean = true;

  constructor(
    private fb: FormBuilder,
    private employDetails: EmployeeService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    public dialogss: MatDialog,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.adminRoleForm = this.fb.group({
      employee: [''],
      adminRole: ['']
    }),
      this.getAllEmployeeDetails();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort
  }


  getAllEmployeeDetails() {
    this.employDetails.getAdmins().subscribe((res) => {
      this.spinner = false;
      if (res) {
        this.allEmployeeDetails = res.employeeData;
        this.dataSource.sort = this.sort;
        // this.allEmployeeDetails.forEach((ele, i) => {
        //   if (ele.role) {
        //     ele.role = "Company Admin"
        //   }
        // })
      }
      this.dataSource = new MatTableDataSource([
        ...this.allEmployeeDetails
      ]);
      this.dataSource.sort = this.sort
    })
  }

  removeEmployee(id) {
    this.spinner = true
    this.employDetails.deleteEmployeeAdmin(id, this.adminRoleForm.value).subscribe(res => {
      this.spinner = false
      this.dataSource.sort = this.sort;
      if (!res.error) {
        this.toastr.success(res.message);
        this.adminRoleForm.reset();
        this.getAllEmployeeDetails();
      } else {
        this.toastr.error(res.message);
      }
      this.dataSource.sort = this.sort;
    }, (err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.logOut();
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }
  logOut() {
    this.router.navigate(['/auth/login']);
    localStorage.clear();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    if (filterValue.length > 2) {
      this.dataSource.filter = filterValue.trim().toLowerCase()
    }
    else if (filterValue.length <= 2) {
      this.dataSource = new MatTableDataSource([
        ...this.allEmployeeDetails
      ]);
    }
  }

  getEmployee() {
    this.employDetails.getEmployee().subscribe(res => {
      this.allEmployeeDetails = res.employeeData;
    });
    this.dataSource.sort = this.sort;
  }


  openDialog() {
    const dialogRef = this.dialog.open(AdminRoleDialogComponent, {
      maxWidth: '25vw',
      width:'100%'
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add') {
        this.getAllEmployeeDetails()
      }
    })
  }

  sendEmailData(event,element) {
    this.spinner = true;
    this.employDetails.sendInvite(element._id).subscribe(res =>{
      this.spinner = false;
      this.toastr.success(res.message);
    })

  }
}
