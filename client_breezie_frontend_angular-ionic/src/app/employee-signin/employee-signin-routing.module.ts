import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeSigninPage } from './employee-signin.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeSigninPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeSigninPageRoutingModule {}
