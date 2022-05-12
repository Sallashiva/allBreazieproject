import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { AdminrolesComponent } from './adminroles/adminroles.component';
import { AgreementComponent } from './agreement/agreement.component';

import { BreezieDashboardComponent } from './breezie-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { EmployeesComponent } from './employees/employees.component';
import { EvacuationComponent } from './evacuation/evacuation.component';
import { IntegrationsComponent } from './integrations/integrations.component';
import { LocationDevicesComponent } from './location-devices/location-devices.component';
import { PreregisteredComponent } from './preregistered/preregistered.component';

import { VisitorsComponent } from './visitors/visitors.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'dashboards',
  pathMatch: 'full'
},
{
  path: '', component: BreezieDashboardComponent, children: [
    {
      path: 'deliveries',
      component: DeliveriesComponent
    },
    {
      path: 'employees',
      component: EmployeesComponent
    },
    {
      path: 'visitors',
      component: VisitorsComponent
    },
    {
      path: 'evacuation',
      component: EvacuationComponent
    },
    {
      path: 'dashboards',
      component: DashboardComponent
    },
    {
      path: 'pre-registration',
      component: PreregisteredComponent
    },
    {
      path: 'integrations',
      component: IntegrationsComponent
    },
    {
      path: 'agreement',
      component: AgreementComponent
    },
    {
      path: 'adminroles',
      component: AdminrolesComponent
    },
    {
      path: 'location',
      component: LocationDevicesComponent
    },
    {
      path: 'account',
      component: AccountComponent
    },

    { path: 'setting', loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule) },
  ]
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BreezieDashboardRoutingModule { }
