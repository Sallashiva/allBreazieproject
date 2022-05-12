import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AccountComponent } from 'src/app/breezie-dashboard/account/account.component';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {

  constructor(private router: Router,private dialogRef:MatDialogRef<AccountComponent>) { }

  ngOnInit(): void {
  }

  confirmFailed() {
      this.dialogRef.close();
    this.router.navigate(['/breezie-dashboard/account'])
  }

}
