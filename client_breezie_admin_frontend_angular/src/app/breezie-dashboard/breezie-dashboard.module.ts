import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  BreezieDashboardRoutingModule
} from './breezie-dashboard-routing.module';
import {
  BreezieDashboardComponent
} from './breezie-dashboard.component';
import {
  SharedModule
} from '../shared/shared.module';
import {
  AccountComponent
} from './account/account.component';
import {
  DashboardComponent
} from './dashboard/dashboard.component';
import {
  VisitorsComponent
} from './visitors/visitors.component';
import {
  VisitorDialogComponent
} from './visitor-dialog/visitor-dialog.component';
import {
  EmployeesComponent
} from './employees/employees.component';
import {
  DeliveriesComponent
} from './deliveries/deliveries.component';
import {
  PreregisteredComponent
} from './preregistered/preregistered.component';
import {
  EvacuationComponent
} from './evacuation/evacuation.component';
import {
  LocationDevicesComponent
} from './location-devices/location-devices.component';
import {
  AdminrolesComponent
} from './adminroles/adminroles.component';
import {
  IntegrationsComponent
} from './integrations/integrations.component';
import {
  AgreementComponent
} from './agreement/agreement.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { HeaderComponent } from './header/header.component';
import { VisitorUpdatediologComponent } from './visitor-updatediolog/visitor-updatediolog.component';


@NgModule({
  declarations: [BreezieDashboardComponent,
    AccountComponent,
    DashboardComponent,
    VisitorsComponent,
    VisitorDialogComponent,
    EmployeesComponent,
    DeliveriesComponent,
    PreregisteredComponent,
    EvacuationComponent,
    LocationDevicesComponent,
    AdminrolesComponent,
    IntegrationsComponent,
    AgreementComponent,
    SidenavComponent,
    HeaderComponent,
    VisitorUpdatediologComponent,
  ],
  imports: [
    CommonModule,
    BreezieDashboardRoutingModule,
    SharedModule,
  ],
  entryComponents: [VisitorsComponent],
  exports: [BreezieDashboardRoutingModule]
})
export class BreezieDashboardModule { }
