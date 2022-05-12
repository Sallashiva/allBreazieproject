import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountComponent } from 'src/app/breezie-dashboard/account/account.component';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private router: Router,private dialogRef:MatDialogRef<AccountComponent>,private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  confirm() {
    this.ngZone.run(() => {
      this.dialogRef.close();
    });
    this.router.navigate(['/breezie-dashboard/dashboards']);
  }
}
