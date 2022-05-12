import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CafeteriaPageRoutingModule } from './cafeteria-routing.module';
import { CafeteriaPage } from './cafeteria.page';
import { SharedModule } from '../shared/shared.module';
import { CafeteriaHomeComponent } from './cafeteria-home/cafeteria-home.component';
import { CafeteriaItemSearchPipe } from './cafeteria-item-search.pipe';
import { LastpageComponent } from './lastpage/lastpage.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { FoodsComponent } from './foods/foods.component';
import { DurationpageComponent } from './durationpage/durationpage.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CafeteriaPageRoutingModule,
    SharedModule,
    ClickOutsideModule,


  ],
  declarations: [
    CafeteriaPage,
    CafeteriaHomeComponent,
    CafeteriaItemSearchPipe,
    LastpageComponent,
    FoodsComponent,
    DurationpageComponent,
  ]
})
export class CafeteriaPageModule {}
