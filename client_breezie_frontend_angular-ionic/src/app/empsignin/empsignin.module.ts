import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmpsigninPageRoutingModule } from './empsignin-routing.module';

import { EmpsigninPage } from './empsignin.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    EmpsigninPageRoutingModule,
    SharedModule
  ],
  declarations: [EmpsigninPage]
})
export class EmpsigninPageModule {}
