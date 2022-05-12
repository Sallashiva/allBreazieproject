import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConditionsComponent } from './conditions/conditions.component';
import { EmployeelistComponent } from './employeelist/employeelist.component';
import { RegisterPage } from './register.page';

const routes: Routes = [{
    path: '',
    component: RegisterPage
  },
  {
    path: 'condition',
    component: ConditionsComponent
  },
  {
    path: 'employeelist',
    component: EmployeelistComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterPageRoutingModule {}
