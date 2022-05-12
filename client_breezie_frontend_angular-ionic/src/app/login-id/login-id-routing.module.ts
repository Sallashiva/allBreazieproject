import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginIdPage } from './login-id.page';

const routes: Routes = [
  {
    path: '',
    component: LoginIdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginIdPageRoutingModule {}
