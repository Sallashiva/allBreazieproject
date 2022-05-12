import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpsignoutPage } from './empsignout.page';

const routes: Routes = [
  {
    path: '',
    component: EmpsignoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpsignoutPageRoutingModule {}
