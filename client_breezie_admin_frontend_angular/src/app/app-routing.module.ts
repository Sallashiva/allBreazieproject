import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from './forgot-password/email/email.component';
import { OtpComponent } from './forgot-password/otp/otp.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrintComponent } from './print/print.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'auth/login',
  pathMatch: 'full'
},
{
  path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
},
{
  path: 'email',
  component: EmailComponent,
},

{
  path: 'otp',
  component: OtpComponent
},
{
  path: 'reset-password',
  component: ResetPasswordComponent
},
{
  path: 'print',
  component: PrintComponent
},
{
  path: 'thank', loadChildren: () => import('./thank-you/thank-you.module').then(m => m.ThankYouModule)
},
{ path: 'breezie-dashboard', loadChildren: () => import('../app/breezie-dashboard/breezie-dashboard.module').then(m => m.BreezieDashboardModule), canActivate: [AuthGuard] },
{
  path: '404',
  component: PageNotFoundComponent,
  canActivate: [AuthGuard]
},
{
  path: '**',
  redirectTo: "/404"
},
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
