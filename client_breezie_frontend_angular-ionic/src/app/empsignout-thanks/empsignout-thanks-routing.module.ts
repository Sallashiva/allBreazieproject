import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpsignoutThanksPage } from './empsignout-thanks.page';

const routes: Routes = [
  {
    path: '',
    component: EmpsignoutThanksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpsignoutThanksPageRoutingModule {}
