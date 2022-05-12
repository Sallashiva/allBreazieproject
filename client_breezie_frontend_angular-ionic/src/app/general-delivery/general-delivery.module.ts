import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralDeliveryPageRoutingModule } from './general-delivery-routing.module';

import { GeneralDeliveryPage } from './general-delivery.page';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralDeliveryPageRoutingModule,
    SharedModule,
    MatAutocompleteModule
  ],
  declarations: [GeneralDeliveryPage]
})
export class GeneralDeliveryPageModule {}
