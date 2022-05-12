import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-signout',
  templateUrl: './employee-signout.component.html',
  styleUrls: ['./employee-signout.component.css']
})
export class EmployeeSignoutComponent implements OnInit {
  exform: FormGroup
  constructor(
    private router: Router,
    private employee: EmployeeService, @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<EmployeesComponent>,
  ) { }

  ngOnInit(): void {
    this.exform = new FormGroup({
      'logoutTime': new FormControl
    })

  }
  cancle() {
    this.dialogRef.close(false);
  }
  accept() {
    this.dialogRef.close(true);
  }
}
