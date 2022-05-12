import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeSignoutPageRoutingModule } from './employee-signout-routing.module';

import { EmployeeSignoutPage } from './employee-signout.page';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeSignoutPageRoutingModule,
    MatDialogModule,
    SharedModule
  ],
  declarations: [EmployeeSignoutPage]
})
export class EmployeeSignoutPageModule {}
