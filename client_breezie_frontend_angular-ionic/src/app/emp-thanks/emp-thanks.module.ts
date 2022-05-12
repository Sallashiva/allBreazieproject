import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpThanksPageRoutingModule } from './emp-thanks-routing.module';

import { EmpThanksPage } from './emp-thanks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmpThanksPageRoutingModule
  ],
  declarations: [EmpThanksPage]
})
export class EmpThanksPageModule {}
