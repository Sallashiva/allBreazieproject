import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VisitorCheckPageRoutingModule } from './visitor-check-routing.module';

import { VisitorCheckPage } from './visitor-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VisitorCheckPageRoutingModule
  ],
  declarations: [VisitorCheckPage]
})
export class VisitorCheckPageModule {}
