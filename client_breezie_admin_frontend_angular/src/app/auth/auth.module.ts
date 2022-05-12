import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterThankyouComponent } from './register-thankyou/register-thankyou.component';
import { RegisterPasswordComponent } from './register-password/register-password.component';


@NgModule({
  declarations: [RegisterComponent, RegisterThankyouComponent, RegisterPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
