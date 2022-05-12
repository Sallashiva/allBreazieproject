import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpsigninPage } from './empsignin.page';

const routes: Routes = [
  {
    path: '',
    component: EmpsigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpsigninPageRoutingModule {}
