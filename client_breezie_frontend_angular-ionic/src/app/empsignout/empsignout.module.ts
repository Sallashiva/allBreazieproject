import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpsignoutPageRoutingModule } from './empsignout-routing.module';

import { EmpsignoutPage } from './empsignout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpsignoutPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EmpsignoutPage]
})
export class EmpsignoutPageModule {}
