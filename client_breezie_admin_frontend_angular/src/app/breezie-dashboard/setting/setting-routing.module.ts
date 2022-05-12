import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesComponent } from '../employees/employees.component';
import { BrandingComponent } from './branding/branding.component';
import { CateringComponent } from './catering/catering.component';
import { ContactlessComponent } from './contactless/contactless.component';
import { IdBadgesComponent } from './id-badges/id-badges.component';
import { SettingDeliveriesComponent } from './setting-deliveries/setting-deliveries.component';
import { SettingEmployeesComponent } from './setting-employees/setting-employees.component';
import { SettingVisitorsComponent } from './setting-visitors/setting-visitors.component';

import { SettingComponent } from './setting.component';
import { VisitorFieldsComponent } from './visitor-fields/visitor-fields.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';

const routes: Routes = [
  {path:'',redirectTo:'welcome-screen',pathMatch:'full'},
  { path: '', component: SettingComponent,children:[
  {path:'welcome-screen',component:WelcomeScreenComponent},
  {path:'branding',component:BrandingComponent},
  {path:'setting-deliveries',component:SettingDeliveriesComponent},
  {path:'setting-visitors',component:SettingVisitorsComponent},
  {path:'visitor-fields',component:VisitorFieldsComponent},
  {path:'id-badges',component:IdBadgesComponent},
  {path:'contactless',component:ContactlessComponent},
  {path:'catering',component:CateringComponent},
  {path:'setting-employees',component:SettingEmployeesComponent}
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
