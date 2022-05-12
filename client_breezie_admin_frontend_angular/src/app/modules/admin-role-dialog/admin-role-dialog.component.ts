import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeResponse } from 'src/app/models/employeeResponse';
import { DeliveriesService } from 'src/app/services/deliveries.service';
import { AdminrolesComponent } from 'src/app/breezie-dashboard/adminroles/adminroles.component';

@Component({
  selector: 'app-admin-role-dialog',
  templateUrl: './admin-role-dialog.component.html',
  styleUrls: ['./admin-role-dialog.component.css']
})


export class AdminRoleDialogComponent implements OnInit {

  employeeForm: FormGroup;
  nodata: boolean = false;
  employee: EmployeeResponse[] = [];
  fullName: string;
  filteredOptions;
  spinner: boolean = true;
  display: boolean = true;
  allEmployeeDetails: EmployeeResponse[]
  dataSource = new MatTableDataSource([])

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deliveryService: DeliveriesService,
    private toastr: ToastrService,
    private employDetails: EmployeeService,
    private dialogRef: MatDialogRef<AdminrolesComponent>
  ) { }
  showFields:boolean = true
  employeeRole:string =""
  ngOnInit(): void {
    this.employeeRole= localStorage.getItem('employeeRole')
    if (this.employeeRole==="location manager") {
      this.showFields=false
    }else{
      this.showFields=true
    }
    this.getAllEmployeeDetails();
    this.getEmployee();
    this.initForm();
  }

  makeEmployeeAdmin() {
    this.spinner = true
    this.employDetails.makeEmployeeAdmin(this.empIds, this.employeeForm.value).subscribe(res => {
      this.spinner = false
      if (!res.error) {
        this.toastr.success(res.message);
        this.employeeForm.reset();
        this.dialogRef.close('add');
      } else {
        this.toastr.error(res.message);
      }
    }, (err) => {
      if (err.status) {
        this.toastr.error(err.error.message);
        this.spinner = false
      } else {
        this.toastr.error('CONNECTION_ERROR');
      }
    })
  }
  cancel(){
    this.dialogRef.close();
  }

  _id: string
  initForm() {
    this.employeeForm = this.fb.group({
      employee: ['', Validators.required],
      adminRoles: ['', Validators.required],
    })
    this.employeeForm.get('employee').valueChanges.subscribe(response => {
      if (response && response.length > 2) {
        this.filterData(response);
      } else {
        this.filteredOptions = [];
      }
    })
  }

  empIds: any
  filterData(enterData) {
    this.filteredOptions = this.employee.filter(item => {
      // this.empIds = item._id
      if (item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1) {
        this.empIds = item._id
      }
      return item.fullName.toLowerCase().indexOf(enterData.toLowerCase()) > -1
    });
    this.nodata = true;
  }

  getEmployee() {
    this.employeeService.getEmployee().subscribe(res => {
     
      res.employeeData.forEach(data=>{
        if (!data.acceess) {
          this.employee.push(data)
          
        }
      })
    });
  }

  getAllEmployeeDetails() {
    this.spinner = true
    this.employDetails.getAdmins().subscribe((res) => {
      this.spinner = false;
      if (res) {
        this.allEmployeeDetails = res.employeeData;
      }
      this.dataSource = new MatTableDataSource([
        ...this.allEmployeeDetails
      ]);
    })
  }
  

}

