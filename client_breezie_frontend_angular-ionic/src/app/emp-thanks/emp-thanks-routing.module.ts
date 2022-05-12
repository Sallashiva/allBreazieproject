import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpThanksPage } from './emp-thanks.page';

const routes: Routes = [
  {
    path: '',
    component: EmpThanksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpThanksPageRoutingModule {}
