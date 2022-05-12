import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorLogoutPageRoutingModule } from './visitor-logout-routing.module';

import { VisitorLogoutPage } from './visitor-logout.page';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatDialogModule,
    MatPaginatorModule,
    SharedModule,
    VisitorLogoutPageRoutingModule
  ],
  declarations: [VisitorLogoutPage]
})
export class VisitorLogoutPageModule {}
