import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceThankyouPage } from './device-thankyou.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceThankyouPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceThankyouPageRoutingModule {}
