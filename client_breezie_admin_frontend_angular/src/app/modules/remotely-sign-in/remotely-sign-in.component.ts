import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-remotely-sign-in',
  templateUrl: './remotely-sign-in.component.html',
  styleUrls: ['./remotely-sign-in.component.css']
})
export class RemotelySignInComponent implements OnInit {
  constructor(
    private employeeService:EmployeeService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef:MatDialogRef<EmployeesComponent>,
    ) { }

  ngOnInit(): void {
  }
  cancle() {
    this.dialogRef.close(false);
  }
  accept(){
    this.dialogRef.close(true);
  }
}
