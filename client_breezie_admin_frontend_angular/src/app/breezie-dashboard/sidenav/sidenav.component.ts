import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';
import { DeliveryModelTrialComponent } from 'src/app/modules/delivery-model-trial/delivery-model-trial.component';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(public dialog: MatDialog,) { }
showFields:boolean = true
employeeRole: string=""
  ngOnInit(): void {
    this.employeeRole= localStorage.getItem('employeeRole')
    if (this.employeeRole==="location manager") {
      this.showFields=false
    }else{
      this.showFields=true
    }
    
    
  }


}
