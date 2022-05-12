import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpCameraPage } from './emp-camera.page';

const routes: Routes = [
  {
    path: '',
    component: EmpCameraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpCameraPageRoutingModule {}
