import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeSigninPageRoutingModule } from './employee-signin-routing.module';

import { EmployeeSigninPage } from './employee-signin.page';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeSigninPageRoutingModule,
    MatDialogModule,
    SharedModule
  ],
  declarations: [EmployeeSigninPage]
})
export class EmployeeSigninPageModule {}
