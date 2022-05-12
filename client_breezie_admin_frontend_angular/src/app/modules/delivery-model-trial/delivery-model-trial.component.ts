import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DeliveriesComponent } from 'src/app/breezie-dashboard/deliveries/deliveries.component';

@Component({
  selector: 'app-delivery-model-trial',
  templateUrl: './delivery-model-trial.component.html',
  styleUrls: ['./delivery-model-trial.component.css']
})
export class DeliveryModelTrialComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<DeliveriesComponent>,
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
