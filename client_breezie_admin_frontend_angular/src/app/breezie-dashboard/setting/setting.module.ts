import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SettingRoutingModule
} from './setting-routing.module';
import {
  SettingComponent
} from './setting.component';
import {
  WelcomeScreenComponent
} from './welcome-screen/welcome-screen.component';
import {
  BrandingComponent
} from './branding/branding.component';
import {
  SettingVisitorsComponent
} from './setting-visitors/setting-visitors.component';
import {
  VisitorFieldsComponent
} from './visitor-fields/visitor-fields.component';
import {
  IdBadgesComponent
} from './id-badges/id-badges.component';
import {
  ContactlessComponent
} from './contactless/contactless.component';
import {
  SettingDeliveriesComponent
} from './setting-deliveries/setting-deliveries.component';
import {
  CateringComponent
} from './catering/catering.component';
import {
  SharedModule
} from 'src/app/shared/shared.module';
import {
  SettingEmployeesComponent
} from './setting-employees/setting-employees.component';
import {
  WelcomeDirective
} from './welcome.directive';
import {
  ColorPickerComponent
} from './color-picker/color-picker.component';
import{ColorDirective}from './color-picker/color.directive';
import { ColorPickerTriggerDirective } from './color-picker/color-picker-trigger.directive';
import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  declarations: [SettingComponent,
     WelcomeScreenComponent,
      BrandingComponent, 
      SettingVisitorsComponent, 
      VisitorFieldsComponent, 
      IdBadgesComponent, 
      ContactlessComponent, 
      SettingDeliveriesComponent, 
      CateringComponent, 
      SettingEmployeesComponent, 
      WelcomeDirective, 
      ColorPickerComponent,
      ColorPickerTriggerDirective,
      ColorDirective
      ],
  imports: [
    CommonModule,
    SettingRoutingModule,
    QRCodeModule,
    SharedModule,
  ]
})
export class SettingModule {}
