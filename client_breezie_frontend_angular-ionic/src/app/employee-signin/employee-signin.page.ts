import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LogoutComponent } from '../employees/employees.component';

@Component({
  selector: 'app-employee-signin',
  templateUrl: './employee-signin.page.html',
  styleUrls: ['./employee-signin.page.scss'],
})
export class EmployeeSigninPage implements OnInit {

  constructor(private dialogRef:MatDialogRef<LogoutComponent>) { }

  ngOnInit() {
  }

  cancle() {
    this.dialogRef.close(false);
  }
  accept(){
    this.dialogRef.close(true);
  }

}
