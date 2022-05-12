import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralDeliveryPage } from './general-delivery.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralDeliveryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralDeliveryPageRoutingModule {}
