import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceThankyouPageRoutingModule } from './device-thankyou-routing.module';

import { DeviceThankyouPage } from './device-thankyou.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceThankyouPageRoutingModule
  ],
  declarations: [DeviceThankyouPage]
})
export class DeviceThankyouPageModule {}
