import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CateringComponent } from 'src/app/breezie-dashboard/setting/catering/catering.component';

@Component({
  selector: 'app-catering-model-trial',
  templateUrl: './catering-model-trial.component.html',
  styleUrls: ['./catering-model-trial.component.css']
})
export class CateringModelTrialComponent implements OnInit {

  constructor(
    private dialogRef:MatDialogRef<CateringComponent>,
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
