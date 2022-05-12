import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginIdPageRoutingModule } from './login-id-routing.module';
import { LoginIdPage } from './login-id.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    LoginIdPageRoutingModule,
    SharedModule
  ],
  declarations: [LoginIdPage]
})
export class LoginIdPageModule {}
