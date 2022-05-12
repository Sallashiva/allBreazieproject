import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-signin',
  templateUrl: './employee-signin.component.html',
  styleUrls: ['./employee-signin.component.css']
})
export class EmployeeSigninComponent implements OnInit {

  constructor(
    private employeeService: EmployeeService, @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<EmployeesComponent>,
  ) { }

  ngOnInit(): void {
  }
  cancle() {
    this.dialogRef.close(false);
  }
  accept() {
    this.dialogRef.close(true);
  }
}
