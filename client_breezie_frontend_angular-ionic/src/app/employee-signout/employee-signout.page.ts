import { Component, OnInit } from '@angular/core';
import { LogoutComponent } from '../employees/employees.component';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-signout',
  templateUrl: './employee-signout.page.html',
  styleUrls: ['./employee-signout.page.scss'],
})
export class EmployeeSignoutPage implements OnInit {

  exform: FormGroup;

  constructor(
    private dialogRef:MatDialogRef<LogoutComponent>,
  ) { }

  ngOnInit() {
    this.exform = new FormGroup({
      'logoutTime': new FormControl
    })
  }

  cancle() {
    this.dialogRef.close(false);
  }
  accept(){
    this.dialogRef.close(true);
  }

}
