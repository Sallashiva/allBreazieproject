import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterPasswordComponent } from './register-password/register-password.component';
import { RegisterThankyouComponent } from './register-thankyou/register-thankyou.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [{
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register-thankyou',
    component: RegisterThankyouComponent
  },
  {
    path: 'register-password',
    component: RegisterPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
