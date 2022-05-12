import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeSignoutPage } from './employee-signout.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSignoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSignoutPageRoutingModule {}
