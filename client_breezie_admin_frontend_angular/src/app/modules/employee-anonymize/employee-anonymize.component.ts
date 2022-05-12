import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeesComponent } from 'src/app/breezie-dashboard/employees/employees.component';

@Component({
  selector: 'app-employee-anonymize',
  templateUrl: './employee-anonymize.component.html',
  styleUrls: ['./employee-anonymize.component.css']
})
export class EmployeeAnonymizeComponent implements OnInit {
  employeeForm: FormGroup
  // signOutForm: any;
  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmployeesComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  ngOnInit(): void {
    console.log(this.editData, 'gfdgfdgh');

    this.employeeForm = this.fb.group({
      delete: ['', Validators.required],
    })
  }
  isDelete: boolean = true
  function(event: any) {
    if (this.employeeForm.value.delete === "DELETE") {
      this.isDelete = false
    } else {
      this.isDelete = true
    }
  }

  addEmployee() {
    this.dialogRef.close(true);
  }
}
