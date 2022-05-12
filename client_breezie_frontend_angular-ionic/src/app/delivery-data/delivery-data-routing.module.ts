import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryDataPage } from './delivery-data.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryDataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryDataPageRoutingModule {}
