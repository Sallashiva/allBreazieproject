import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VisitorCheckPage } from './visitor-check.page';

const routes: Routes = [
  {
    path: '',
    component: VisitorCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisitorCheckPageRoutingModule {}
