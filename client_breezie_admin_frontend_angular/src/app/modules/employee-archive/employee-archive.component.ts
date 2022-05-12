import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-archive',
  templateUrl: './employee-archive.component.html',
  styleUrls: ['./employee-archive.component.css']
})
export class EmployeeArchiveComponent implements OnInit {

  constructor(private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  ngOnInit(): void {
  }
  cancle() {
    this.dialogRef.close(false);
  }
  archive() {
    this.dialogRef.close(true);
  }
}
