import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpsignoutThanksPageRoutingModule } from './empsignout-thanks-routing.module';

import { EmpsignoutThanksPage } from './empsignout-thanks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpsignoutThanksPageRoutingModule
  ],
  declarations: [EmpsignoutThanksPage]
})
export class EmpsignoutThanksPageModule {}
