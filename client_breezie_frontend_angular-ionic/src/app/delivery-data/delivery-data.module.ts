import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeliveryDataPageRoutingModule } from './delivery-data-routing.module';

import { DeliveryDataPage } from './delivery-data.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeliveryDataPageRoutingModule
  ],
  declarations: [DeliveryDataPage]
})
export class DeliveryDataPageModule {}
