import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';

@Component({
  selector: 'app-employee-restore',
  templateUrl: './employee-restore.component.html',
  styleUrls: ['./employee-restore.component.css']
})
export class EmployeeRestoreComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  ngOnInit(): void {
  }
  cancle() {
    this.dialogRef.close(false);
  }
  accept() {
    this.dialogRef.close(true);
  }
}
